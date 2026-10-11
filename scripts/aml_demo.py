"""Demo data for the note "Ranking bank customers with weighted PageRank".

Re-runs the team's ranking on the full competition graph (300,008 customers) exactly as the
competition code does, checks it against the team's saved output, and exports one small
neighbourhood for the browser: no names or customer IDs, only red-flag types, suspicion scores,
and each customer's global rank at successive steps of the walk.

Needs the competition repository (github.com/jwardbond/2023-imi-bigdata) checked out locally,
plus pandas, scipy and networkx (requirements-dev.txt).

Usage: AML_REPO=~/github/2023-imi-bigdata python scripts/aml_demo.py  ->  notes/aml-pagerank/graph.json
"""

from __future__ import annotations

import json
import os
from pathlib import Path

import networkx as nx
import numpy as np
import pandas as pd
from scipy.sparse import coo_array
from scipy.stats import rankdata

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "notes" / "aml-pagerank" / "graph.json"
DATA = Path(os.environ.get("AML_REPO", Path.home() / "github" / "2023-imi-bigdata")).expanduser() / "data" / "processed"
STEPS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]
CENTER_RANK = 3        # the unflagged customer the walk ranks highest
SUSPICIOUS = 1.0       # edge suspicion counted as "suspicious" in the figure
MAX_NODES = 60


def load():
    nodes = pd.read_parquet(DATA / "pagerank" / "input_node_scores.parquet")
    edges = pd.read_parquet(DATA / "pagerank" / "input_edge_scores.parquet")[["cust_id_sender", "cust_id_receiver", "score"]]
    ids = np.sort(nodes["cust_id"].unique())
    idx = pd.Series(np.arange(len(ids)), index=ids)
    beta = nodes.set_index("cust_id").loc[ids, "score"].to_numpy()
    e = pd.DataFrame({"s": idx[edges["cust_id_sender"]].to_numpy(), "t": idx[edges["cust_id_receiver"]].to_numpy(),
                      "w": edges["score"].to_numpy()})
    return ids, beta, e


def walk(n: int, beta: np.ndarray, e: pd.DataFrame):
    """The competition update: P <- gamma * (M P) + (1 - gamma) * beta/|beta|, theta = 1, edges both ways."""
    both = pd.concat([e, e.rename(columns={"s": "t", "t": "s"})], ignore_index=True)
    both["w"] = both["w"] + 0.01
    w = both.groupby(["s", "t"], as_index=False)["w"].sum()
    strength = np.bincount(w["s"], weights=w["w"], minlength=n)
    M = coo_array((w["w"] / strength[w["s"]], (w["t"], w["s"])), shape=(n, n)).tocsr()
    gamma = 1 / (1 + 0.8 * np.exp(-strength))
    b = beta / beta.sum()
    return M, gamma, b, strength


def ranks(p: np.ndarray) -> np.ndarray:
    """1 = most suspicious; ties share the best rank (most customers have no red flags at step 0)."""
    return rankdata(-p, method="min").astype(int)


def main() -> None:
    ids, beta, e = load()
    n = len(ids)
    M, gamma, b, strength = walk(n, beta, e)

    # Check against the team's saved output (their run starts from a uniform vector).
    p = np.full(n, 1 / n)
    for _ in range(10000):
        q = gamma * M.dot(p) + (1 - gamma) * b
        q += (1 - q.sum()) / n
        done = (np.abs(p - q) / p).max() < 1e-10
        p = q
        if done:
            break
    else:
        raise RuntimeError("ranking did not converge within 10,000 iterations")
    saved = DATA / "nodes_rev_old.parquet"
    if saved.exists():
        s = pd.read_parquet(saved).set_index("cust_id").loc[ids, "score"].to_numpy()
        scaled = (p - p.min()) / (p.max() - p.min())
        assert np.abs(scaled - s).max() < 1e-9, "does not reproduce the team's saved ranking"
        print("reproduces the team's saved ranking exactly")
    final_rank = ranks(p)

    # For the figure, start the walk from the node scores so step 0 is "red flags only".
    hist, p = {0: ranks(b)}, b.copy()
    for k in range(1, STEPS[-1] + 1):
        p = gamma * M.dot(p) + (1 - gamma) * b
        p += (1 - p.sum()) / n
        if k in STEPS:
            hist[k] = ranks(p)

    center = next(i for i in np.argsort(final_rank, kind="stable") if beta[i] == 0 and final_rank[i] >= CENTER_RANK)
    und = pd.concat([e, e.rename(columns={"s": "t", "t": "s"})], ignore_index=True)
    nb = und[und["s"] == center]
    keep = [center] + nb.sort_values("w", ascending=False)["t"].drop_duplicates().tolist()
    # second hop: everyone the centre's strongly suspicious counterparties deal with
    strong = [c for c in keep[1:] if strength[c] >= 5 * SUSPICIOUS]
    second = und[und["s"].isin(strong) & ~und["t"].isin(keep)]
    keep += second.sort_values("w", ascending=False)["t"].drop_duplicates().tolist()
    keep = keep[:MAX_NODES]
    pos_of = {c: k for k, c in enumerate(keep)}
    sub = e[e["s"].isin(pos_of) & e["t"].isin(pos_of)].groupby(["s", "t"], as_index=False)["w"].sum()

    kyc = pd.read_parquet(DATA / "kyc_full.parquet").set_index("cust_id")
    flags_of = {"named_trafficker": "name matched to a trafficking case", "label": "labelled high-risk",
                "occ_animal": "works with animals", "occ_wealth": "wealthy clients", "occ_int": "international trade"}

    def flags(i: int) -> list[str]:
        cid = ids[i]
        if cid not in kyc.index:
            return []
        row = kyc.loc[cid]
        result = [txt for col, txt in flags_of.items() if col in row and pd.notna(row[col]) and float(row[col]) > 0]
        if beta[i] > 0 and not result:
            result.append("unusually large cash transactions")
        return result

    g = nx.Graph()
    g.add_nodes_from(range(len(keep)))
    g.add_weighted_edges_from((pos_of[s], pos_of[t], 1.0 + w) for s, t, w in sub.itertuples(index=False))
    pos = nx.kamada_kawai_layout(g, weight=None)
    xy = np.array([pos[k] for k in range(len(keep))])
    xy = (xy - xy.min(0)) / (xy.max(0) - xy.min(0))

    data = {
        "n_customers": int(n), "n_flagged": int((beta > 0).sum()), "steps": STEPS, "center": 0,
        "nodes": [{"x": round(float(x), 3), "y": round(float(y), 3), "beta": round(float(beta[i]), 3),
                   "strength": round(float(strength[i]), 2), "gamma": round(float(gamma[i]), 3), "flags": flags(i),
                   "rank": [int(hist[k][i]) for k in STEPS]} for (x, y), i in zip(xy, keep)],
        "edges": [[pos_of[s], pos_of[t], round(float(w), 2)] for s, t, w in sub.itertuples(index=False)],
    }
    c = data["nodes"][0]
    print(f"centre: no red flags, rank {c['rank'][0]} -> {c['rank'][-1]} of {n}; "
          f"{len(keep)} customers, {len(sub)} payments in the neighbourhood")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, separators=(",", ":"), ensure_ascii=False))
    print(f"wrote {OUT.relative_to(ROOT)} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

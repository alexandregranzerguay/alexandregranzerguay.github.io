---
title: Ranking bank customers with weighted PageRank
date: 2026-10-11
summary: A PageRank-based method that combines customer indicators and transaction scores to rank customers in synthetic banking data.
tags: [graph analytics, anti-money laundering, PageRank]
script: figure.js
---

For the 2024 IMI BIGDataAIHUB competition, Jesse Ward-Bond, Muhammad Maaz and I worked with synthetic banking data to identify customers and transaction networks associated with wildlife-trafficking risk. Our team [placed first](https://www.utm.utoronto.ca/imi/news/imi-bigdataaihub-announces-winners-2024-competition-fighting-crime-big-data-and-artificial). We used weighted PageRank to rank customers by their own indicators and their transaction connections. The [code and notebooks](https://github.com/jwardbond/2023-imi-bigdata) also cover customer classification, name matching and a Flask app for exploring the results.

## Customer and transaction scores

We first assigned scores to customers and payments using indicators informed by [FINTRAC's operational alert on illegal wildlife trade](https://fintrac-canafe.canada.ca/intel/operation/oai-wildlife-eng). The weights are set in `task_2/weights.yml`.

A customer's score combines occupation indicators, an existing high-risk label, matches to names collected from public sources, and the proportion of unusually large cash deposits or withdrawals. A payment's score combines transaction indicators: e-transfer message keywords, wire-transfer countries, the occupations of the parties involved, and payments to shipping businesses. These are weighted sums of indicators; they are not estimated probabilities of trafficking.

Customer scores use each customer's own information. The graph adds information about the customers they transact with, including those with a zero customer score.

## Graph construction

The graph contains 300,008 customers, including external counterparties identified in the transfer data. E-transfers and wire transfers form the edges. Cash transactions contribute to customer scores rather than edges.

Each payment is included in both directions, so the ranking can pass information between sender and receiver. We add 0.01 to each payment score before summing payments between each pair of customers. This keeps payments with no indicators in the graph and means that the number of payments also contributes to the edge weight.

Let $w_{ji}$ be this combined weight from customer $j$ to customer $i$, and let $s_j = \sum_i w_{ji}$. Customer $j$ distributes its score across its neighbours in proportion to $w_{ji}/s_j$. The implementation stores these proportions in a sparse matrix, avoiding a dense matrix with one entry for every pair of customers.

## Ranking update

Our method adapts the weighted PageRank approach of [Zhang, Wang and Yan](https://arxiv.org/abs/2104.02764). At each iteration, it combines scores received through the graph with the customer's own score:

$$Q_i = \gamma_i \sum_{j:s_j>0} \frac{w_{ji}}{s_j} P_j + (1 - \gamma_i) \frac{\beta_i}{\sum_j \beta_j}, \qquad \gamma_i = \frac{1}{1 + 0.8 e^{-s_i}} .$$

Here, $P_j$ is the previous iteration's score and $\beta_i$ is the customer's own indicator score. A larger total edge weight $s_i$ gives more weight to the graph term. It measures accumulated transaction scores, including the 0.01 baseline, rather than the amount of money transferred.

We then apply a uniform correction so the scores sum to one, where $N$ is the number of customers:

$$P_i^{\mathrm{next}} = Q_i + \frac{1 - \sum_j Q_j}{N} .$$

In this custom PageRank-style iteration, the node-specific $\gamma_i$ multiplies the score received at customer $i$; it is not a departure probability for a standard random walk. The correction is needed because the update does not otherwise preserve the total score, including at customers with no graph edges.

The ranking starts with equal scores and stops when the largest relative change is below $10^{-10}$, with a cap on the number of iterations. It then rescales the final scores to the range $[0,1]$ for display. That rescaling does not change the ranking.

## Interactive example

A small neighbourhood of the transaction graph appears below. Names and identifiers are omitted, and ranks are calculated across all 300,008 customers. Larger nodes rank higher; filled nodes are in the top 1,000. Highlighted edges have a combined payment score of at least 1, before the baseline is added.

<figure id="aml-fig" data-src="/notes/aml-pagerank/graph.json">
<noscript><p>This figure needs JavaScript. The data is in <a href="/notes/aml-pagerank/graph.json">graph.json</a>.</p></noscript>
</figure>

The slider starts at the customer scores, so step 0 represents the ranking before information passes through the graph. The central customer has a zero customer score. As the iterations proceed, its connections to customers with positive scores raise its rank to third out of 300,008. Move the slider to follow the ranking across iterations, or click a node to inspect its score and rank.

Connections to customers with positive scores can therefore raise a customer's priority even when its own score is zero. We used the ranking to select customers and connections for further review. A high rank is a review priority, not a probability of involvement in trafficking.

[`scripts/aml_demo.py`](https://github.com/alexandregranzerguay/alexandregranzerguay.github.io/blob/main/scripts/aml_demo.py) reproduces the saved competition ranking and exports the neighbourhood and ranks used above.

## References

- FINTRAC. [*Operational alert: Laundering the proceeds of crime from illegal wildlife trade*](https://fintrac-canafe.canada.ca/intel/operation/oai-wildlife-eng).
- Zhang, P., Wang, T. and Yan, J. (2021). [*PageRank centrality and algorithms for weighted, directed networks with applications to World Input-Output Tables*](https://arxiv.org/abs/2104.02764). arXiv:2104.02764.

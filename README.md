This is my solution to a computational geometry problem to find all the 'interior faces' (i.e. polygons) of a connected, planar graph.

Algorithm overview:

The algorithm I developed takes a divide and conquer approach. It starts by finding a random[0] closed path (representing a potentially 'composite'[1] polygon) to partition the graph into two regions: one on the interior of the found path, one exterior.

The algorithm then recurses, repeating the same behavior within the boundary if closed path which was found at the previous level: this subgraph is also a connected, planar graph; the only difference is we know its boundary explicitly (which is unknown at the top level).

The algorithm bottoms out when one of the random closed paths it finds is itself an 'atomic' polygon rather than composite.

-------------
[0] The 'randomness' here just comes from the input data not having any specified order.

[1] By 'composite' polygon I'm referring to closed paths which form polygons, but also have within them additional closed paths that form polygons. 'Atomic' polygons have no additional vertices on their interior.

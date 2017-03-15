Here is a simple example of the result of asking for all paths
leading to a given goal state in a Pathway Logic (PL) model of Hras activation.
Here there are 6 paths (see hrasAllPaths.txt).  

A path is a set of rules which if applied in some order lead from
the initial state (the HrasDish in this case) to a goal state
(here a state in which Hras - GTP is present).

The question what are useful ways to visualize this set of paths.
This becomes a serious challenge as the starting network gets larger.
For example in the PL model of Erks (Erk1/Erk2) activation/TEY phosporylation
there are more than 1400 paths!

In PL a single path is visualized as the Petri Net formed from the
rules in the path.  

The Hras model is shown as a Petri net in hras.irt.egf.png.
   Ovals are occurrences, rectangles are rules,
   arrows connect input to rules, and rules to output.
   dashed arrows connect controls (unchanged, required context) to rules 
   (test arcs in Petri net speak).  Dark ovals are the initial marking.

hras.irt.egf.path-compare.png shows a comparison of two of the paths
as the union of the rules in the two paths.  Elememnts in both paths
are colored pink, cyan and blue/lavendar identify elements that are
in just one of the paths.  

This works nicely for two paths, can be generalized to 3, but beyond that
it doesn't work!

The folder JSONU has a json representation of the Hras model.
 hrasDish.json 
  specifies the names of rules and the occurrences in the initial state 
 rules.json -- specifies the rules named in hrasDish.json
 occs.json -- specifies the structure of occurrences
 locs.json, mods.json, basicOps.json  -- the underlying controlled vocabulary

A rule has the following attributes/labels
  "name"
	"consumed"  -- the input occurrences
	"produced"	-- the output occurrences
	"controls"  -- the occurrences that must be there but are not changed

Formally an occurrence (called physical entity in BioPax)	consists of an
entity (here just proteins), modifications of the entity (for example Yphos),
and the location of the entity.  It corresponds to a place in Petri net speak.

For manipulating networks of rules, you probably only need names of occurrences. 

 

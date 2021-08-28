## This tool is no longer developed - [I am actively developing a desktop version with editing capability, compatible with regular Agda](https://github.com/marcinjangrzybowski/cubeViz2)  



# Experimental tool for visualization terms in cubical Agda.

At this stage of development, the only utility of this tool is limited to helping in developing some intuition about more complicated terms involving nested hcomp in cubical Agda. By examining applications of assoc in different ways ([lhs](https://raw.githack.com/marcinjangrzybowski/cubeViz/master/main.html#assocAlt,pentA) vs [rhs](https://raw.githack.com/marcinjangrzybowski/cubeViz/master/main.html#assocAlt,pentB')), I was able to write a [tedious proof of pentagon-identity](https://github.com/agda/cubical/blob/77fbf78ddc57d499a51e0cc4e37508c6c3caed29/Cubical/Foundations/GroupoidLaws.agda#L296).

At this moment definitions from Agda need to be rewritten by hand to be visualized by this tool.
I do not expect anybody to do this, so if you want to see some definition here PM me :)
(marcinjangrzybowski@gmail.com).


Parser and crude type-checker implements a subset of cubical Agda.
Some major diferences:
 - no inductive datatypes (this sadly make this tool unsuitable for visualizing equivalences between HITs)
 - no implicit arguments (this, unfortunately, results in quite verbose terms)
 - no holes and bi-directional TC

Some minor diferences:
 - collapsed universe structure (Type : Type) (which should not be a problem for the scope of this experiment)
  - "∧" has higher precedence than "∨" operator, which is not the case in regular cubical Agda where there is no difference in precedence of those.  
 

Examples of files with the definition in this crude agda-like language are in src/MicroAgda/SampleFiles/.


You can open the [whole file](https://raw.githack.com/marcinjangrzybowski/cubeViz/master/main.html#assocAlt), by picking the file name from the first row of names at the top of the screen (only terms of dimension > 1 will be visualized). And then focus on a particular definition by clicking on the thumbnail next to the code (where you can highlight both parts of the diagram and part of the corresponding term).


Although type checker won't complain, visualization is performed only when hcomp is most outer term at every level, and {A} argument of hcomp is the same across all of the term. This is not the limit of diagram drawing convention, but the limitation of this particular implementation. 

Arguments of Typeω are prohibited, so you cannot add to context cube without explicitly described sides (ie. argument of type "I → I → A" cannot be added to context).
Instead of this, types of higher dimensional arguments must be provided as nested PathP. (It is always possible to rewrite former by adding (3^n - 1) arguments with a skeleton of a cube).

For each argument in context, a "generic" diagram for this argument is created:
- 0-dimensional arguments correspond to consecutive colors
- 1-dimensional arguments correspond to lines starting with colors of it ends
- 2-dimensional arguments correspond to squares with particular borders
- ... and so on

if you have two arguments of the same type, they will be created in different ways, inside the n-cube will be different:

[note the "generated generic arguments", on the right](https://raw.githack.com/marcinjangrzybowski/cubeViz/master/main.html#assocAlt,compSq')


Diagrams and generic arguments can be created for terms of arbitrary dimensions. But rendering is implemented only for 2d now. Presenting diagrams of higher dimension pose a challenge in terms of UI/UX. 


Those cubical primitives are implemented at the moment:

* I0
* I1
* Max
* Min 
* Neg
* Partial   
* IsOne 
* OneIsOne 
* Sub      
* Hcomp
* OutS      
* PathP
* InS 

All the machinery for transport and gluing is missing for now. 

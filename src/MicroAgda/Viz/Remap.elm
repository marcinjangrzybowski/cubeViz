module MicroAgda.Viz.Remap exposing (..)

import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T

import MicroAgda.Drawing exposing  (..)

import MicroAgda.StringTools exposing (..)

import Either exposing (..)

import Color

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict

import Set

import Combinatorics exposing (..)

import MicroAgda.Viz.Structures exposing (..)


type alias Remap = (Int , List (Int, Bool))


tailPieces2Remap : Int -> TailPieces -> Piece -> Remap
tailPieces2Remap n tp pc =
    List.map (applyTo pc) tp
   |> Tuple.pair n     


type alias Remapable a =
    { neg : Int -> a -> a
    , degen : Int -> a -> a
    , diag : (a , List Int) -> (a , List Int)
    , rearange : List Int -> a ->  (a , List Int)         
        }

insideNeg : Int -> Inside -> Inside
insideNeg i = Tuple.mapSecond <| precompose (mapAsList subsetLI (mapAt i not))
    
csetNeg : Int -> CSet -> CSet                  
csetNeg i cl =
    case cl of
        CSet ins -> CSet (insideNeg i ins) 
        Degen k x -> if k == i
                       then (Degen k x)
                       else
                           let ii = (punchOut k i) in
                           Degen k (csetNeg ii x)     

diagCSetHead : CSet -> CSet
diagCSetHead cs =
    let       
        diagInside : Inside -> Inside
        diagInside = Tuple.mapBoth (\x -> x - 1) ( 
            precompose
             (mapAsList subsetLI
                 (\lb -> List.head lb |> Maybe.map (\h -> h :: lb) |> Maybe.withDefault lb)           
                  ))
    in
    case cs of
        CSet ins -> CSet (diagInside ins)
        Degen 0 x -> x
        Degen 1 x -> x
        Degen k x -> Degen (k - 1) (diagCSetHead x)               

-- here l must be sorted!!                                  
diagCSet : (CSet , List Int) ->  (CSet , List Int)          
diagCSet (cs , l) = 
    ((case l of
        [] -> cs
        x :: [] -> cs
        x :: y :: tl -> if x == y
                        then diagCSet (diagCSetHead cs , y :: tl) |> Tuple.first
                        else ( mapCSetUnder (\cc -> diagCSet (cc , y :: tl) |> Tuple.first) cs )
     )
    , (removeDupes l))
                     
mapCSetUnder : (CSet -> CSet) -> CSet -> CSet
mapCSetUnder f = identity

rearangeCSet : List Int -> CSet ->  (CSet , List Int)          
rearangeCSet l0 cl0 = 
    let
        rCell : List Int -> CSet -> CSet          
        rCell l cs = 
          (let  
               sortingPerm : Permutation
               sortingPerm = sortPerm l
               
               permuteInside : Permutation -> Inside -> Inside
               permuteInside x = Tuple.mapSecond <|
                                 precompose (mapAsList subsetLI (permuteList x ))  

               rearanged : CSet
               rearanged = 
                   case cs of
                       CSet ins
                           -> CSet
                              (permuteInside sortingPerm ins)
                       Degen k cst -> Degen
                                      (permuteInt (invPermutation sortingPerm) k)
                                      (rCell (removeFromList k l) (cst) )        
                               
           in rearanged) 
    in ( rCell l0 cl0 , l0 |> List.sort)                 

                 
remapableInside : Remapable CSet 
remapableInside =
    { neg = csetNeg
    , degen = Degen
    , diag = diagCSet
    , rearange = rearangeCSet         
        }
                  
remapAbs : Remapable a -> Remap -> a -> a 
remapAbs r (dim , l) a =
    let negAll : List Bool -> a -> a
        negAll lb cs = List.foldr
            (Maybe.map (r.neg) >> Maybe.withDefault identity )
            cs (lb
                |> List.map (not >> bool2Mb)   
                |> List.indexedMap (const >> Maybe.map ))

        degenMissing : (a , List Int) -> a          
        degenMissing (cl ,  li) =
            li
                |> List.foldl (Set.remove) (Set.fromList (range dim))
                |> (\si -> List.foldl r.degen cl (Set.toList si))   
                
    in 
           a 
        |> negAll (List.map Tuple.second l)
        |> r.rearange (List.map Tuple.first l)   
        |> r.diag   
        |> degenMissing          
       
remap = remapAbs remapableInside            

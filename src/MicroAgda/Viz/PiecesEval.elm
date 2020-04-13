module MicroAgda.Viz.PiecesEval exposing (..)

import MicroAgda.Internal.Term as I
import MicroAgda.Internal.Ctx as C
import MicroAgda.TypeChecker as TC
import MicroAgda.Internal.Translate as T

import MicroAgda.Drawing exposing  (..)

import MicroAgda.StringTools exposing (..)

import Color

import ResultExtra exposing (..)

import Debug exposing (..)

import Dict

import Set

import Combinatorics exposing (..)

import  MicroAgda.Viz.Structures exposing (..)

piecesStratTail : DCtx -> List I.Term
                   -> Result String TailPieces
piecesStratTail dc tl = mapListResult (piecesStrat dc) tl
    
piecesStrat : DCtx -> I.Term -> Result String (Piece -> (Int , Bool))      
piecesStrat dc tm =
    let fList : Result String (List (Piece , ( Int , Bool)))
        fList =
           mapAllPieces (dimOfCtx dc) (\pc ->
              pieceEval dc tm pc |> (\tm1 ->
                 case tm1 of
                    I.Def (I.BuildIn I.I1) [] -> Err ("interval end spotted!")
                    I.Def (I.BuildIn I.I0) [] -> Err ("interval end spotted!")
                    I.Def (I.FromContext k) [] ->
                                         getDimIndex dc k
                                         |> Result.map(\(DimIndex j) -> ( j , True))
                    I.Def (I.BuildIn I.Neg) [x] ->
                           case I.elimArg x of
                               I.Def (I.FromContext k) [] ->
                                            getDimIndex dc k
                                         |> Result.map(\(DimIndex j) -> ( j , False))
                               _ -> Err "pieces strat error 2"                     
                    _ -> Err "pieces strat error"                     
                                      ) |> Result.map (Tuple.pair pc) )
          |> mapListResult identity     
    in fList |> Result.map makeFnPiece
             |> Result.map (\f -> f >> Maybe.withDefault (-1 , True)) -- <- this defaul should not happen
             |> describeErr "piecesStrat"


pieceEval : DCtx -> I.Term -> Piece -> I.Term
pieceEval dc tm0 pc =

   let
       (crn , prm) = pc |> (isoPiece |> Tuple.second)
                     


                 -- careful with convention! (i , False) , means that (1 - x_i) , without
                 -- inverting below, nth bool would have meining of oposite side!
       compArr : List (Int , Bool)
       compArr =
           let ca = permuteList prm ( List.indexedMap (Tuple.pair) (subsetLI.toL crn))
                      |> List.map (Tuple.mapSecond not)
           in ca ++ (List.reverse (List.map (Tuple.mapSecond not) ca))
              


       peSortVia : List (Int , Bool) ->  (Int , Bool) -> (Int , Bool) -> Bool
       peSortVia ca (i1 , b1) (i2 , b2) =
           case ca of
               (i , b) :: tl ->
                   case ((i == i1 && b == b1) , (i == i2 && b == b2)) of
                       (True , _) -> True
                       (_ , True) -> False
                       _ -> peSortVia tl (i1 , b1) (i2 , b2)              
               [] -> True
                      
       toDI = Tuple.mapFirst (getDimIndex dc
                 >> Result.map (\(DimIndex x) -> x)
                 >> Result.withDefault (-1))

       peSort : (Int , Bool) -> (Int , Bool) -> Bool
       peSort x y = peSortVia compArr (toDI x) (toDI y)

                     
       peMin : (Int , Bool) -> (Int , Bool) -> (Int , Bool) 
       peMin x y = if peSort x y
                   then x
                   else y    

       peMax : (Int , Bool) -> (Int , Bool) -> (Int , Bool)
       peMax x y = if peSort x y
                   then y
                   else x

       peEnc : (Int , Bool) -> Maybe I.Term
       peEnc (k , b) =
           if b
           then Just (I.Def (I.FromContext k) [])
           else Just (I.Def (I.BuildIn I.Neg) [I.elim (I.Def (I.FromContext k) [])])    
           
       evF : I.Term -> Maybe I.Term
       evF tm =
           case I.tmBIView tm of
               I.JB2 I.Max (I.JT (I.Def (I.FromContext x) [])) (I.JT (I.Def (I.FromContext y) []))
                   -> peMax (x , True) (y , True) |> peEnc
               I.JB2 I.Max (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JT (I.Def (I.FromContext y) []))
                   -> peMax (x , False) (y , True) |> peEnc
               I.JB2 I.Max (I.JT (I.Def (I.FromContext x) [])) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMax (x , True) (y , False) |> peEnc
               I.JB2 I.Max (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMax (x , False) (y , False) |> peEnc
               I.JB2 I.Min (I.JT (I.Def (I.FromContext x) [])) (I.JT (I.Def (I.FromContext y) []))
                   -> peMin (x , True) (y , True) |> peEnc
               I.JB2 I.Min (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JT (I.Def (I.FromContext y) []))
                   -> peMin (x , False) (y , True) |> peEnc
               I.JB2 I.Min (I.JT (I.Def (I.FromContext x) [])) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMin (x , True) (y , False) |> peEnc
               I.JB2 I.Min (I.JB1 I.Neg (I.JT (I.Def (I.FromContext x) []))) (I.JB1 I.Neg (I.JT (I.Def (I.FromContext y) [])))
                   -> peMin (x , False) (y , False) |> peEnc              
               I.JB2 I.Min x y -> evF (I.fromBIView y)
                                  |> Maybe.map (\t2 ->
                                     I.fromBIView (I.JB2 I.Min x (I.JT t2)))
               I.JB2 I.Max x y -> evF (I.fromBIView x)
                                  |> Maybe.map (\t2 ->
                                     Just (I.fromBIView (I.JB2 I.Max (I.JT t2) y)))
                                  |> Maybe.withDefault (
                                      evF (I.fromBIView y)
                                          |> Maybe.map (\t2 ->
                                              I.fromBIView (I.JB2 I.Max x (I.JT t2)))
                                          )
               _ -> Nothing

   in maybeLoop evF tm0                 

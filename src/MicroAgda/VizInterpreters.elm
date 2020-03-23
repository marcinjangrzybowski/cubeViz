module MicroAgda.VizInterpreters exposing (..)

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

import MicroAgda.Viz exposing (..)


dullIPR : Interpreter ()
dullIPR = fromNindependent {
           toStr = const "DullOk"
         , renderCells = const (Ok ()) 
         , fillMissing = const (PCubB (() , True)) --meaningles bool
         , transA3 = identity        
         , transA3fill = const (identity)
         , collectAll = const ()     
        }


debugingIPR : (Cell -> a) -> (a -> String) -> (a -> Int)
                -> Interpreter (CubBB (Maybe a))
debugingIPR fromC ts gDim =
       let

           
           getD2 : (CubBB (Maybe a)) -> Int
           getD2 x =
               case x of
                   PCubB (Nothing , _) -> -1
                   PCubB (Just y , b) -> gDim y
                   HcompB f bed -> getD2 bed        
           
           getD : CubAC (CubBB (Maybe a)) -> Int
           getD c =
               case c of
                   PCubA x -> getD2 x 
                   HcompA si bo -> getD bo        

                                   
           toS x =
               case x of
                   PCubB (Nothing , _) -> Nothing
                   PCubB (Just y , b) -> Just ((ts y) ++ " " ++ (choose b "F" "T"))
                   HcompB f bed -> 
                           Just (("hcomp:\n" ++ (indent 4 (
                                (tabulateFaces (getD2 bed) f)
                                |> List.filterMap (\((i , b) , s)
                                   -> (toS s)
                                      -- |> Maybe.withDefault ("nic")
                                      -- |> Just                 
                                      |> Maybe.map (\ss ->
                                     "\n(" ++ (String.fromInt i) ++ "="
                                        ++ (choose b "i0" "i1") ++") → "
                                         ++ "\n" ++ (indent 2 ss)
                                                  )
                                             )     
                                |> String.join "" )
                                     ))
                               ++ "\nbottom:\n "
                                   ++ (indent 4 (toS bed |> Maybe.withDefault "Empty??"))
                               )      

           fiMi : CubAC (CubBB (Maybe a)) -> CubBB (CubBB (Maybe a))
           fiMi c =
               case c of
                   PCubA x -> PCubB ( x , False)
                   HcompA si bo -> 
                                    HcompB
                                   (faceToSubFace (getD bo)
                                    >> si
                                    >> Maybe.map (fiMi)
                                    >> Maybe.withDefault ( PCubB (  PCubB (Nothing , True) , True ) )
                                    
                                   )
                                   (fiMi bo)
                                       
           colA : CubBB (CubBB (Maybe a)) -> CubBB (Maybe a) 
           colA c =
               case c of
                   PCubB (x , _) -> x
                   HcompB si bo -> HcompB (si >> colA) (colA bo) 
                                       
       in        
        fromNindependent {
           toStr = toS >> Maybe.withDefault "Empty??"
         , renderCells = fromC >> Just >> pairR False >> PCubB >> Ok 
         , fillMissing = fiMi
         , transA3 = identity        
         , transA3fill = const identity
         , collectAll = colA     
        }

prerenderIPR : Interpreter (CubBB (Maybe Cell))
prerenderIPR = debugingIPR identity cellToString dimOfCell
               
-- PCubA x | HcompA
    
-- type alias Interpreter a = {
--           toStr : a -> String,
--           renderCells : Cell -> Result String a,
--           fillMissing : CubAC a -> CubBB a,
--           transA3 : (a , Bool) -> (a , Bool),          
--           transA3fill : Face -> (a , Bool) -> (a , Bool),
--           collectAll : CubBB a -> a     
--         }

    

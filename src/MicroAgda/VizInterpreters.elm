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
         , renderCells = const (()) 
         , collectAll = const ()     
        }


-- debugingIPR : (Cell -> a) -> (a -> String) -> (a -> Int)
--                 -> Interpreter (CubBB (Maybe a))
-- debugingIPR fromC ts gDim =
--        let

           
--            getD2 : (CubBB (Maybe a)) -> Int
--            getD2 x =
--                case x of
--                    PCubB (Nothing) -> -1
--                    PCubB (Just y) -> gDim y
--                    HcompB f bed -> getD2 bed        
           
                                   
--            toS x =
--                case x of
--                    PCubB (Nothing) -> Nothing
--                    PCubB (Just y) -> Just (ts y)
--                    HcompB f bed -> 
--                            Just (("hcomp:\n" ++ (indent 4 (
--                                 (tabulateFaces (getD2 bed) f)
--                                 |> List.filterMap (\((i , b) , s)
--                                    -> (toS s)
--                                       -- |> Maybe.withDefault ("nic")
--                                       -- |> Just                 
--                                       |> Maybe.map (\ss ->
--                                      "\n(" ++ (String.fromInt i) ++ "="
--                                         ++ (choose b "i0" "i1") ++") → "
--                                          ++ "\n" ++ (indent 2 ss)
--                                                   )
--                                              )     
--                                 |> String.join "" )
--                                      ))
--                                ++ "\nbottom:\n "
--                                    ++ (indent 4 (toS bed |> Maybe.withDefault "Empty??"))
--                                )      

                                       
--            colA : CubBB (CubBB (Maybe a)) -> CubBB (Maybe a) 
--            colA c =
--                case c of
--                    PCubB x -> x
--                    HcompB si bo -> HcompB (si >> colA) (colA bo) 
                                       
--        in        
--         fromNindependent {
--            toStr = toS >> Maybe.withDefault "Empty??"
--          , renderCells = fromC >> Just  >> PCubB  
--          -- , fillMissing = fiMi
--          , collectAll = colA     
--         }

-- prerenderIPR : Interpreter (CubBB (Maybe Cell))
-- prerenderIPR = debugingIPR identity cellToString dimOfCell
               
-- -- PCubA x | HcompA
    
-- -- type alias Interpreter a = {
-- --           toStr : a -> String,
-- --           renderCells : Cell -> Result String a,
-- --           fillMissing : CubAC a -> CubBB a,
-- --           transA3 : (a , Bool) -> (a , Bool),          
-- --           transA3fill : Face -> (a , Bool) -> (a , Bool),
-- --           collectAll : CubBB a -> a     
-- --         }

    

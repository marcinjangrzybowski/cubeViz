module MicroAgda.Internal.Translate exposing
    ( .. )

import Debug exposing (..)

import Dict 

import Set exposing (..)

import MicroAgda.Internal.ArgInfo as AI exposing (ArgInfo)
import MicroAgda.Internal.Term as I
import MicroAgda.Raw as R
import MicroAgda.Internal.Ctx as C
import MicroAgda.StringTools exposing (..)

import ResultExtra exposing (..)

swap : (a -> b -> c ) -> b -> a -> c
swap f b a = f a b 
       
foldInternalApp : C.Ctx -> List String -> R.Raw -> I.Elims -> R.Raw
foldInternalApp c bnd = List.foldl (I.elimArg >> (internal2raw c bnd) >> (swap R.App))   


newName : List String -> String ->  String 
newName ls s = makeFresh s (Set.fromList ls)                        

internal2raw : C.Ctx -> List String -> I.Term -> R.Raw
internal2raw c bnd t =
   case t of
       I.Pi dt at -> let nn = newName bnd at.absName in
                      R.Pi (nn) (internal2raw c bnd (dt.unDom))
                       (internal2raw c (nn :: bnd) (at.unAbs)) 
       I.Lam ai at ->
           let nn = newName bnd at.absName  in
           R.Lam (nn) (internal2raw c (nn :: bnd) (at.unAbs)) 
       I.LamP pcs ee -> foldInternalApp c bnd
                        (R.LamP (List.map (\pc ->
                                               ( (List.map (\(ie , b) ->
                                                  (internal2raw c bnd (ie )
                                                 , (b) )) pc.subFace
                                                     )
                                               , internal2raw c bnd pc.body )
                                          ) pcs))
                           ee              
       I.Var j ee -> foldInternalApp c bnd
               (R.Var (Maybe.withDefault
                           ("(INTERNAL ERR! wrng abs level! Translate.elm : "
                                   ++ (String.fromInt j) ++ " "
                                   ++ (absPreview bnd)++ ")")
                            
                           ((lookByIntInList bnd j)
                            |> Maybe.map (\nm -> (nm )))    
                            -- |> Maybe.map (\nm -> (nm ++ "_"++String.fromInt j)))
                            -- |> Maybe.map (\nm -> ("Var(" ++String.fromInt j ++ " , " ++ nm  ++")")))
                      ))
                   ee
       I.Def (I.FromContext j) ee ->
           foldInternalApp c bnd
               (R.Var ((Maybe.withDefault ("(INTERNAL ERR! not in scope! Translate.elm : "
                                   ++ (String.fromInt j) ++ " "
                                   ++ (C.ctxPreview c)++ ")")

                            (C.lookNameByInt c j)
                          -- (Just ("Def-" ++ (String.fromInt j)))
                      ) ))
                   ee
       I.Def (I.BuildIn bi) ee ->
           foldInternalApp c bnd
               (R.Var (I.buildInToken2String bi))
                   ee
       I.Star -> R.Var "TypeInf"
                 

ct2str : C.Ctx -> C.CType -> String                  
ct2str c = C.toTm >> (internal2raw c []) >> R.raw2String

t2str : C.Ctx -> I.Term -> String                  
t2str c = (internal2raw c []) >> R.raw2String                             

t2strWS : C.Ctx -> List String -> I.Term -> String                  
t2strWS c ls = (internal2raw c ls) >> R.raw2String                             
          
t2strNoCtx =  t2str C.emptyCtx

-- UNSAFE use only after typechecking
-- raw2internal : C.Ctx -> R.Raw -> I.Term
-- raw2internal = todo ""
               
-- type Raw =
--    Pi String Raw Raw
--  | Lam String Raw
--  | LamP (List PartialCase )   
--  | Var String 
--  | App Raw Raw
                    

module MicroAgda.Internal.Ctx exposing
    (..)

import Debug exposing (..)

import Set exposing (..)

import MicroAgda.StringTools exposing (..)

import MicroAgda.Internal.Term exposing (..)

import ResultExtra exposing (..)

import Dict 

type CType = CT Type



    
toTm : CType -> Term    
toTm (CT t) = t


-- convention : head is the youngest symbol
-- but indexing is reversed - 0 - is the oldest symbol
              
type alias Ctx = List ((String , CType) , Maybe Term)

                
-- type alias Env = (Defined , Ctx)

-- emptyEnv = (Dict.empty , emptyCtx)    
    
youngestSymbolId : Ctx -> Int  
youngestSymbolId = ctxToList >> List.length >> (\x -> x - 1)
                   
ctxToList : Ctx -> List (String , CType)
ctxToList x = List.map (Tuple.first ) x 

ctxToListFull : Ctx -> List ((String , CType) , Maybe Term)
ctxToListFull x = x 

listToCtxFull :  List ((String , CType)  , Maybe Term) -> Ctx
listToCtxFull x = x 
              
lookByName : Ctx -> String -> Maybe CType    
lookByName c s = lookByNameInList (ctxToList c) s             

lookByNameInList : List (String , CType) -> String -> Maybe CType    
lookByNameInList c s = case c of
                     [] -> Nothing
                     (n , ty) :: xs -> if n == s
                                       then Just ty
                                       else (lookByNameInList xs s)

lookByNameInListWithIndex : List (String , z) -> String -> Maybe (Int , z)    
lookByNameInListWithIndex c s = case c of
                     [] -> Nothing
                     (n , ty) :: xs -> if n == s
                                       then Just (0 , ty)
                                       else Maybe.map
                                               (Tuple.mapFirst (\j -> j + 1))
                                               (lookByNameInListWithIndex xs s)                                           
lookByNameWithIndex c = (lookByNameInListWithIndex  (ctxToList c))
                          >> Maybe.map (Tuple.mapFirst (\x -> (List.length (ctxToList c)) - 1 - x))

lookByNameWithIndexFull c = (lookByNameInListWithIndex  (List.map  (\((q , w) , e) -> (q , (w , e)))
                                                             (ctxToListFull c)))
                          >> Maybe.map (Tuple.mapFirst (\x -> (List.length (ctxToListFull c)) - 1 - x))
                              
lookByInt : Ctx -> Int -> Maybe CType    
lookByInt c i = lookByIntInList (List.reverse (ctxToList c)) i |> Maybe.map (Tuple.second)

lookNameByInt : Ctx -> Int -> Maybe String    
lookNameByInt c i = lookByIntInList (List.reverse (ctxToList c)) i |> Maybe.map (Tuple.first)                
ctxPreview = ctxToList >> List.map Tuple.first >> List.reverse >> absPreview                

extendInth : Int -> Ctx -> (Ctx , List String) 
extendInth k c =
    let ss = c |> symbolsSet |> Set.union buildInNamesSet
        names = makeFreshList (padRight k "i" (String.split "" "ijkl")) ss
    in
    List.foldl (\name -> (swapFn (swapFn extend name) (CT mkInterval)) ) c names
    |> pairR names        
                       
extend : Ctx -> String -> CType -> Ctx
extend c s cty = listToCtxFull (((s , cty) , Nothing) :: (ctxToListFull c) )         

define : Ctx -> String -> CType -> Term -> Ctx
define c s cty tm = listToCtxFull (((s , cty) , Just tm) :: (ctxToListFull c) )         
                 
                 
symbolsSet : Ctx -> Set String
symbolsSet = ctxToList >> (List.map Tuple.first) >> Set.fromList

emptyCtx : Ctx             
emptyCtx = listToCtxFull []

unsafeSubstInCtx : (Ctx , Term) -> Int -> (Term , CType) -> Result String (Ctx , Term)            
unsafeSubstInCtx (c , t) i (x , ct) = 
   case c of
     [] -> Ok (c , t)
     ((n , CT ty) , mbt) :: ctl ->
        ((Maybe.map (substIC i x) mbt) |> maybeMixRes)
          |> Result.andThen (\mbt2 ->
          (substInCtx (ctl , ty) i (x , ct) , substIC i x t) 
          |> thenPairResult (\(cc , ty2) -> \b -> Ok ((( n , CT ty2) , mbt2) :: cc , b)))
            
unsafeSubstInCtx2 : (Ctx , Term) -> Int -> (Term , CType) -> Result String (Ctx , Term)            
unsafeSubstInCtx2 (c , t) i (x , ct) = 
   case c of
     [] -> Ok (c , t)
     ((n , CT ty) , mbt) :: ctl ->
          ((Maybe.map (substIC2 i x) mbt) |> maybeMixRes)
          |> Result.andThen (\mbt2 ->
             (substInCtx2 (ctl , ty) i (x , ct) , substIC2 i x t) 
             |> thenPairResult (\(cc , ty2) -> \b -> Ok ((( n , CT ty2) , mbt2) :: cc , b)))
-- removes completely from Ctx             
substInCtx : (Ctx , Term) -> Int -> (Term , CType) -> Result String (Ctx , Term) 
substInCtx (c , t) i (x , ct) =
   case lookByInt c i of
       Nothing -> Ok (c , t)
       Just ctt -> if (betaEq (toTm ctt) (toTm ct))
                   then (if (i == youngestSymbolId c)
                         then (unsafeSubstInCtx (List.drop 1 c , t) i (x , ct))
                         else (unsafeSubstInCtx (c , t) i (x , ct))    
                        )
                        
                   else (Err "Wrong type while substituting")    


                       
-- converts to definition                       
substInCtx2 : (Ctx , Term) -> Int -> (Term , CType) -> Result String (Ctx , Term) 
substInCtx2 (c , t) i (x , ct) =
   case lookByInt c i of
       Nothing -> Ok (c , t)
       Just ctt -> if (betaEq (toTm ctt) (toTm ct))
                   then (if (i == youngestSymbolId c)
                         then (unsafeSubstInCtx2
                                   ((mapHead (\((q , w) , _ ) -> ((q , w ) , Just x)  ) c)
                                                , t)
                                   i (x , ct))
                         else (unsafeSubstInCtx2 (c , t) i (x , ct))    
                        )
                        
                   else (Err "Wrong type while substituting")                           


-- it is "Cubical" arity!!! not usual one...                       
arity : CType -> Maybe Int
arity x =
    case (toPiData (toTm x)) of
        Just (do , cod) ->
            case (do.unDom , cod.unAbs) of
                 ((Def (BuildIn Interval) []) , y) -> (arity (CT y))
                                                            |> (Maybe.map (\z -> z + 1))
                 _ -> Nothing   
        Nothing -> case toTm x of
                       (Def (FromContext _) []) -> Just 0
                       (Var _ []) -> Just 0                                
                       _ -> Nothing
                       

-- works only on "proper" cubical types, where I and only I apears at the end ane only on the end                            
toCubical : Ctx -> CType -> (Ctx , CType)
toCubical c ct =
  case toPiData (toTm ct) of
      Nothing ->  (c , ct)
      Just (do , bo) ->         
          let tyTail = (absApply bo (Def (FromContext ( (List.length c) )) []))
              tyHead = CT do.unDom
              cTail = extend c bo.absName tyHead        
          in
          case (tyHead , tyTail) of
              (CT (Def (BuildIn Interval) []) , _) -> (c , ct)
              (_ , Ok t) -> toCubical cTail (CT t)
              _ -> (c , ct)              

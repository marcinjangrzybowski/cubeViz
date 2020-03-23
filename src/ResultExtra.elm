module ResultExtra exposing (..)

import Result exposing (..)

import Set

import Dict


import Debug exposing (..)

andThenWith : (a -> Result e b) -> Result e a ->  Result e (a , b) 
andThenWith f = Result.andThen (\a -> f a |> Result.map (\b -> (a , b)) ) 

thenPairResult : (a -> b -> Result e c) -> (Result e a , Result e b)  ->  Result e c
thenPairResult f rab =
    case rab of
        (Err e , _) -> Err e
        (_ , Err e) -> Err e
        (Ok a , Ok b) -> f a b               

mapPairResult : (a -> b -> c) -> (Result e a , Result e b)  ->  Result e c
mapPairResult f = thenPairResult (\x -> \y -> Ok (f x y))

maybeMixRes : Maybe (Result e x) -> Result e (Maybe x)                  
maybeMixRes = Maybe.map (Result.map Just) >>  Maybe.withDefault (Ok Nothing)

mapMaybeResult : (x -> Result a b) -> Maybe x -> Maybe b
mapMaybeResult f mx =
    case mx of
        Nothing -> Nothing
        Just x -> f x |> Result.toMaybe
    
resMixMaybe : Result e (Maybe x) -> Maybe (Result e x)                  
resMixMaybe r =               
    case r of
         Err e -> Just (Err e)
         Ok Nothing -> Nothing           
         Ok (Just x) -> Just (Ok x)


mapHead : (a -> a) -> List a -> List a
mapHead f l =
    case l of
        [] -> []
        x :: xs -> f x :: xs      
           
mapListResult : (a -> Result e b) -> List a -> Result e (List b)
mapListResult f la =
    case la of
        [] -> Ok []
        x :: xs -> case (f x) of
                       Err e -> Err e
                       Ok y -> case mapListResult f xs of
                                   Err ee -> Err ee
                                   Ok ys -> Ok (y :: ys)         

-- mapListResult2 : (a -> Result e b) -> (a - > b) -> List a -> Result (List e) (List b)
-- mapListResult2 f fail = List.map f >> List.map (convergeResults

lookByIntInList : List a -> Int -> Maybe a
lookByIntInList l i =
    case l of
        [] -> Nothing
        x :: xs -> if i == 0
                   then Just x
                   else lookByIntInList xs (i - 1)

removeFromList : Int -> List a -> List a                       
removeFromList i l =
    case (l , i) of
        ([] , _) -> []
        (x :: xs , 0) -> xs
        (x :: xs , _) -> x :: (removeFromList (i - 1) xs)                


removeIndexSet : (Set.Set Int) -> List a -> List a 
removeIndexSet si =
    List.indexedMap (\i -> if (Set.member i si) then (const Nothing) else Just)
    >> List.filterMap identity    
    
updateInList : Int -> a -> List a -> List a                       
updateInList i a l =                          
    case (l , i) of
        ([] , _) -> []
        (x :: xs , 0) -> a :: xs
        (x :: xs , _) -> x :: (updateInList (i - 1) a xs)                
    
tryResultArr : List (Result a b) -> Result (List (Result a b)) ((List b)) 
tryResultArr l = mapListResult (identity) l |> Result.mapError (\_ -> l)


               
expectedQ : Result a b -> Bool
expectedQ r =
    case r of
        Ok _ -> True 
        Err _ -> False    

convergeResult : (a -> c) -> (b -> c) -> Result a b -> c
convergeResult fa fb x = case x of
                             Err a -> fa a
                             Ok b -> fb b

resolvedResult : Result a a -> a                                     
resolvedResult = convergeResult identity identity


extractOptionalResult : Result a (a , b) -> (a , Maybe b)
extractOptionalResult = convergeResult
                        (\a -> (a , Nothing))
                         (\(a , b) -> (a , Just b))
                        
convResLists : Result (List a) (List b) -> List (Result a b)
convResLists = convergeResult (List.map Err) (List.map Ok)



               
-- mapFold : (v -> a -> b) -> (b -> v -> v) ->  v -> List a -> List b
-- mapFold f1 f2 v0  = List.foldl (\a -> \(lb , v) ->
--                                  let nb = f1 v a in
--                                  ((List.append lb [nb]) , f2 nb v)) ([] , v0)
--                     >> Tuple.first

mapFoldSafe : (v -> a -> Result b c) -> (a -> b) -> (c -> b) -> (c -> v -> v)
               -> v -> List a -> Result (List b) (v , List c)
mapFoldSafe f1 f1fail f2 f3 v0 = 
        let foldF : (a -> (Result (List b) (v , List c)) -> (Result (List b) (v , List c)))
            foldF a =
                Result.mapError (\e -> (f1fail a) :: e)
                >> Result.andThen (\(v , lsc) ->
                                     f1 v a
                                     |> Result.map (\newC -> (f3 newC v , newC :: lsc))
                                     |> Result.mapError (\bs -> (bs) :: (List.map f2 lsc)))    
                     
         in List.foldl foldF (Ok (v0 , []))
             >> Result.map (Tuple.mapSecond List.reverse)
             >> Result.mapError List.reverse            

maybeLoop : (a -> Maybe a) -> a -> a                 
maybeLoop f a =
    f a |> Maybe.map (maybeLoop f) |> Maybe.withDefault a  

doAndPairL : (a -> b) -> a -> (b , a)
doAndPairL f a = (f a , a)            

pairR : a -> b -> (b , a)
pairR a b = (b , a)
            
doAndPairR : (a -> b) -> a -> (a , b)
doAndPairR f a = (a , f a)                             

mapSame : (a -> b) -> (a , a) -> (b , b)
mapSame f = Tuple.mapBoth f f
    
pairFrom : (a -> b) -> (a -> c) -> a -> (b , c)
pairFrom f g a = (f a , g a)            

pairApp : (a -> b , c -> d) -> (a , c) -> (b , d) 
pairApp ( f , g ) (x , y) = (f x , g y)
    
comp : (x -> a) -> (a -> b) -> x -> b 
comp f g  = f >> g                  

maybeTry : Maybe a -> Maybe a -> Maybe a
maybeTry x = Maybe.map (Just) >> Maybe.withDefault x           

const : a -> b -> a
const x _ = x             

const2 = const >> const
            
-- List (a -> b) -> a -> List b
            
choose : Bool -> x -> x -> x
choose b f t = if b then t else f

boolElim : a -> a -> Bool -> a
boolElim f t b = if b then t else f

               
resultPairR : (a , Result b c) -> Result b (a , c)
resultPairR (a , rbc) = Result.map (Tuple.pair a) rbc                

listInsert : Int -> a -> List a -> List a                        
listInsert i a l = 
   case i of
       0 -> a :: l
       _ -> case l of
                [] -> a :: []
                x :: xs -> x :: (listInsert (i - 1) a xs)       

apply : (a -> b) -> a -> b
apply f g = f g        

applyTo : a -> (a -> b) -> b
applyTo g f = f g          

bool2Mb : Bool -> Maybe ()
bool2Mb b = choose b Nothing  (Just ())
    
mbSwap : List Int -> Maybe (Int , Int)
mbSwap l0 =
    let mbSwapH : List Int -> Maybe (Int)
        mbSwapH l =
           case l of
               [] -> Nothing
               x :: xs ->
                   xs
                   |> List.indexedMap Tuple.pair    
                   |> List.filter (\(_ , i)  -> i < x)      
                   |> List.head
                   |> Maybe.map (Tuple.first >> succ)   
    in mbSwapH l0
      |> Maybe.map (Tuple.pair 0 >> Just)
      |> Maybe.withDefault (
          List.tail l0
          |> Maybe.andThen mbSwap
          |> Maybe.map (mapSame succ)
         )   

-- j is larger than i         
swapList : (Int, Int) -> List Int -> List Int
swapList (i , j) l =
    lookByIntInList l i
    |> ( lookByIntInList l j
    |> Maybe.map2 (\y -> \x ->
          l |>
          List.indexedMap (\k -> \z ->
                 (if k == i
                 then y
                 else (if (k == j) then x else z))              
                          )
      ))
    |> Maybe.withDefault l
        

--- only for purpose of testing functions for swaps!!       
sortListTest : List Int -> List Int
sortListTest = maybeLoop (\l -> mbSwap l |> Maybe.map swapList |> Maybe.map (applyTo l) )   

succ : Int -> Int        
succ i = i + 1

zip : (List a , List b) -> List (a , b)         
zip (la , lb) =
   case (la , lb) of
       (a :: ass , b :: bss) -> (a , b) :: (zip (ass , bss)) 
       _ -> []

         
type alias Iso a b = ((a -> b) , (b -> a))         

listIso : Iso a b -> Iso (List a) (List b)
listIso = Tuple.mapBoth List.map List.map    
 
transpFn : Iso a b -> (b -> b) -> (a -> a)          
transpFn ( f , g ) x = f >> x >> g 
    
fake : a -> a
fake = identity       

precompose : (l -> z) -> (z -> a) -> (l -> a)
precompose x f a = x a |> f

postcompose : (z -> a) -> (l -> z) ->  (l -> a)
postcompose f x a = x a |> f                                 

precompose2 : (a -> d) -> ((a -> b) -> c) -> ((d -> b) -> c)                       
precompose2 = precompose >> precompose

                   
indexOf : Int -> List Int -> Maybe Int                   
indexOf i l =
    case l of
        [] -> Nothing
        x :: xs -> if x == i
                  then Just 0
                  else  indexOf i xs
                        |> Maybe.map succ


lastIndexOf : Int -> List Int -> Maybe Int
lastIndexOf i l =
    (indexOf i (List.reverse l))
    |> Maybe.map (\ii ->     
    (((List.length l) - 1) - ii))
        
mapAt : Int -> (a -> a) -> List a -> List a                    
mapAt i f = List.indexedMap (\j -> \x -> if j == i then (f x) else x)

filterMaybe : (a -> Bool) -> Maybe a -> Maybe a           
filterMaybe test = Maybe.andThen (\a -> (if (test a) then Just a else Nothing))


isEqual x y =
    case (compare x y) of
        EQ -> True
        _ -> False

isLessThan x y =
    case (compare y x) of
        LT -> True
        _ -> False      
             
findDuplicated : (List Int) -> Maybe Int
findDuplicated = (List.foldr (\x -> \(mbI , st) ->
                             case mbI of
                                 Just y -> (Just y , st)
                                 Nothing ->
                                     if (Set.member x st)
                                     then (Just x , st )
                                     else (Nothing , Set.insert x st)    
                             )
                 (Nothing , Set.empty)) >> (Tuple.first)                    

{-| Change how arguments are passed to a function.
This splits paired arguments into two separate arguments.
-}
curry : (( a, b ) -> c) -> a -> b -> c
curry f a b =
    f ( a, b )


{-| Change how arguments are passed to a function.
This combines two arguments into a single pair.
-}
uncurry : (a -> b -> c) -> ( a, b ) -> c
uncurry f ( a, b ) =
    f a b

swap : (a -> b -> c) -> b -> a -> c
swap f b a = f a b        

funStich : (a -> c) -> (c -> a -> b)  -> a -> b 
funStich g f a = f (g a) a                

kvListToStr : (a -> String) -> (b -> String) -> List (a , b) -> String
kvListToStr fk fv =
    List.map (\(i , v) -> ((fk i) ++ " : " ++ (fv v)))
   >> String.join ("\n")
                 

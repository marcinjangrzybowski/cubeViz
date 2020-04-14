module Combinatorics exposing (..)

import Result exposing (..)
import ResultExtra exposing (..)

import Debug exposing (..)

import Set

import Dict

factorial : Int -> Int
factorial n = 
  case n of
    0 -> 1
    1 -> 1
    2 -> 2
    3 -> 6   
    4 -> 24
    5 -> 120
    _ -> n * (factorial (n - 1))

type alias ListInterpretable a b = {
       toL : a -> List b ,
       fromL : List b -> a ,
       card : Int -> Int ,
       fromI : Int -> Int -> a ,
       toI : a -> Int     
    }

    
type Permutation = Permutation Int Int 

type Subset = Subset Int Int

type SubFace = SubFace Int Int         

type Piece = Piece Int Int Int   

type Zone = Zone Int Int Int Int
    
type Word = Word Int Int Int

type alias Face = (Int , Bool)

    
permutationLI : ListInterpretable Permutation Int
permutationLI =
  let
      toInt : Permutation -> Int
      toInt (Permutation _ i) = i
                              
      toList : Int -> Int -> List Int        
      toList n k =
         if n > 0
         then ((modBy n k) :: (toList (n - 1) (k // n)) )
         else []

      fromList : List Int -> Permutation       
      fromList l =
          let n = List.length l in
          case l of
              x :: xs -> Permutation n (x + n * (toInt (fromList xs)))  
              [] -> Permutation 0 0    
      -- toList : Int -> Int -> List Int
      -- toList n k =
      --   permute0 n k
      --   |> List.reverse    
      --   |> List.indexedMap (\i -> \j -> listInsert j i) 
      --   |> List.foldl apply []
  
       
  in { toL = \(Permutation n k) -> toList n k
     , fromL = fromList
     , card = factorial
     , fromI = Permutation
     , toI = toInt          
     }


subsetLI : ListInterpretable Subset Bool
subsetLI =                    
  let
      toInt : Subset -> Int
      toInt (Subset _ i) = i
                              
      toList : Int -> Int -> List Bool        
      toList n k =
         if n > 0
         then (((modBy 2 k) == 1) :: (toList (n - 1) (k // 2)) )
         else []

      fromList : List Bool -> Subset       
      fromList l =
          let n = List.length l in
          case l of
              x :: xs -> Subset n ((choose x 0 1) + 2 * (toInt (fromList xs)))  
              [] -> Subset 0 0    
  
       
  in { toL = \(Subset n k) -> toList n k
     , fromL = fromList
     , card = \x -> 2 ^ x
     , fromI = Subset
     , toI = toInt          
     }

subFaceLI : ListInterpretable SubFace (Maybe Bool)
subFaceLI =                    
  let
      toInt : SubFace -> Int
      toInt (SubFace _ i) = i
                              
      toList : Int -> Int -> List (Maybe Bool)        
      toList n k =
         if n > 0
         then (( case (modBy 3 k) of
                    0 -> Just False
                    1 -> Just True
                    _ -> Nothing

                    ) :: (toList (n - 1) (k // 3)) )
         else []

      fromList : List (Maybe Bool) -> SubFace       
      fromList l =
          let n = List.length l in
          case l of
              x :: xs -> SubFace n (
                                   (x |> Maybe.map (\xx -> choose xx 0 1) |> Maybe.withDefault 2)
                                       + 3 * (toInt (fromList xs)))  
              [] -> SubFace 0 0    
  
       
  in { toL = \(SubFace n k) -> toList n k
     , fromL = fromList
     , card = \x -> 3 ^ x
     , fromI = SubFace
     , toI = toInt          
     }
      

      
lengthLI : ListInterpretable a aa -> a -> Int      
lengthLI li x = x |> li.toL |> List.length
                
prodLI : ListInterpretable a aa
         -> ListInterpretable b bb
         -> Iso (a , b) c   
         -> ListInterpretable c (aa , bb)
prodLI aLI bLI (to , from) =

     let 
      toList : (a , b) -> List (aa , bb)        
      toList (a , b) = zip ((aLI.toL a) , (bLI.toL b))

      fromList : List (aa , bb) -> (a , b)       
      fromList = List.unzip >> Tuple.mapBoth aLI.fromL bLI.fromL 
                 
     in  {
       toL = from >> toList
     , fromL = fromList >> to
     , card = (\x -> aLI.card x * bLI.card x)
     , fromI = \n -> \i -> to ((aLI.fromI n (modBy (aLI.card n) i)) , bLI.fromI n (i // (aLI.card n))) 
     , toI = from >> (\(a , b) ->
           let ca = aLI.card (lengthLI aLI a)
           in  (bLI.toI b)*ca + (aLI.toI a))               
     }


makeFnLI : ListInterpretable a aa -> List (a , x) -> a -> Maybe x
makeFnLI li =
    List.map (Tuple.mapFirst li.toI)
    >> Dict.fromList >> (swap Dict.get)
    >> comp li.toI      
          
    
makeFnPiece  : List (Piece , x) -> Piece -> Maybe x
makeFnPiece = makeFnLI pieceLI


              
makeFnSubFace : List (SubFace , x) -> SubFace -> Maybe x
makeFnSubFace = makeFnLI subFaceLI

subFaceFromDict : Int -> Dict.Dict Int Bool -> SubFace
subFaceFromDict n d = range n |> List.map ((swap Dict.get) d) |> subFaceLI.fromL                 
              
mapAsList : ListInterpretable a aa -> (List aa -> List aa) -> a -> a
mapAsList li f = li.toL >> f >> li.fromL   

mapAllLI : ListInterpretable a aa -> Int -> (a -> x) -> List x                 
mapAllLI li n f =
    n |> li.card |> range |> List.map (li.fromI n >> f)
           
mapAllPieces : Int -> (Piece -> x) -> List x
mapAllPieces = mapAllLI (pieceLI)

printFunLI : ListInterpretable a aa -> Int ->
             (a -> String) -> (x -> String)
                  -> (a -> x)  -> String            
printFunLI li n fk fv f =
    mapAllLI li n (doAndPairR f)                
    |> kvListToStr fk fv

--

printPiecesFn n = printFunLI pieceLI n (pieceLI.toI >> String.fromInt)

-- List

removeDupes : List Int -> List Int
removeDupes = Set.fromList >> Set.toList


-- Permutations

compPerm : Permutation -> Permutation -> Permutation
compPerm p1 p2 = fromUsual (permuteList p2 (toUsual p1))

                 
                 
permuteList : Permutation -> List a -> List a
permuteList p l =
    List.foldr (\(i , a) -> listInsert i a ) [] (zip ((permutationLI.toL p) ,  l))

permuteInt : Permutation -> Int -> Int
permuteInt p i = indexOf i (toUsual p) |> Maybe.withDefault -1 

toUsual : Permutation -> List Int
toUsual pm = permuteList pm (List.range 0 ((lengthLI permutationLI pm) - 1))               

fromUsual : List Int -> Permutation 
fromUsual =
    let fu0 li =
             (case li of
              [] -> []
              _ -> let i = Maybe.withDefault 0 (indexOf 0 li)
                       rest = removeFromList i li
                   in i :: (fu0 (List.map (\x -> x - 1) rest))   
             )
    in fu0 >> permutationLI.fromL

range : Int -> List Int
range n = List.range 0 (n - 1)
          
invPermutation : Permutation -> Permutation
invPermutation = mapUsual
    (\l ->
        List.map (\x -> (Maybe.withDefault 0 (indexOf x l)) ) (range (List.length l)))              
        
mapUsual : (List Int -> List Int) -> Permutation -> Permutation 
mapUsual f = toUsual >> f >> fromUsual 


dedupAndSort : List comparable -> Dict.Dict comparable Int
dedupAndSort = Set.fromList >> Set.toList >> List.sort
               >> List.indexedMap (\i -> \x -> (x , i)) >> Dict.fromList   

-- this is permutation which set up elements in given order
-- if you reverse this permutation and permute input with it you will sort input

sortPerm : List comparable -> Permutation
sortPerm l =
    let
        extracted : Dict.Dict comparable Int
        extracted = dedupAndSort l 

                    
        confined : List Int
        confined = l
                   |> List.map (Dict.get >> applyTo extracted >> Maybe.withDefault -1 ) 

    in fromDupli confined                    
-- must be feed list without missing numbers (elements must form range from 0 to some n)             
fromDupli : List Int -> Permutation
fromDupli li =
    let

        fillD : List Int ->  List Int
        fillD = maybeLoop (\l ->
                           findDuplicated l
                          |> Maybe.andThen (\x ->
                                lastIndexOf x l
                                |> Maybe.map (\i ->
                                     l |> List.map (punchIn (succ x)) |>  mapAt i succ
                                               )
                                       )  )
                           
    in  (fillD li)  |> fromUsual            




punchIn : Int -> Int -> Int
punchIn k i =
        (if i<k
          then i
          else (i + 1)
         )

punchOut : Int -> Int -> Int
punchOut k i =
    (if i<k
     then i
     else (i - 1))       
        
-- Piece

prePermutePiece : Permutation -> Piece -> Piece
prePermutePiece p =
    -- mapAsList pieceLI (List.unzip >>
    --    (Tuple.mapBoth (invPermutation >> toUsual >> fromUsual >> invPermutation) (permuteList p) )                    
    --                        >> uncurry zip)
    
    let (t , f) = isoPiece
    in f >> (Tuple.mapBoth
                 (mapAsList subsetLI (permuteList p))
                 (invPermutation >> toUsual >> (permuteList p) >> fromUsual >> invPermutation)
            ) >> t              

diagPiece : Piece -> Piece
diagPiece =
    let (t , f) = isoPiece
    in f >> (Tuple.mapBoth
                 (mapAsList subsetLI
                      (\lb -> List.head lb |> Maybe.map (\h -> h :: lb) |> Maybe.withDefault lb)  )
                 (toUsual >> (
                   \lp -> (indexOf 0 lp) |> Maybe.withDefault 0 |>
                            (\i ->  listInsert i -1 lp) |> List.map succ
                             ) >> fromUsual )
            ) >> t              

degenPiece : Set.Set Int -> Piece -> Piece         
degenPiece si =         
    let (t , f) = isoPiece
    in f >> (Tuple.mapBoth
                 (mapAsList subsetLI
                      (removeIndexSet si))
                 (invPermutation >> toUsual >> (removeIndexSet si) >> fromUsual >> invPermutation)
            ) >> t
        
pieceInj : Int -> Bool -> Piece -> Piece
pieceInj i b  =
    let (t , f) = isoPiece
    in f >> (Tuple.mapBoth
                 (mapAsList subsetLI (listInsert i b))
                 (
                      invPermutation >>
                          toUsual
                      >> ((List.map succ) >> listInsert i 0)
                      >> fromUsual
                      >> invPermutation
                 )
            ) >> t


-- face nth dim is incrasng ambient dim of subface (nth -1)        
subFaceInj : Face -> SubFace -> SubFace  
subFaceInj (i , b ) sf =
    sf |> subFaceLI.toL |> listInsert i (Just b) |> subFaceLI.fromL

-- face nth dim is incrasng boath ambient and actual dim of subface        
        
subFaceDeg : Int -> SubFace -> SubFace  
subFaceDeg i sf =
    sf |> subFaceLI.toL |> listInsert i (Nothing) |> subFaceLI.fromL          

getSubFaceCoDim : SubFace -> Int
getSubFaceCoDim = subFaceLI.toL >> List.filter (mb2Bool) >> List.length

getSubFaceDim : SubFace -> Int
getSubFaceDim = subFaceLI.toL >> List.filter (mb2Bool >> not) >> List.length                  

toFace : SubFace -> Maybe Face
toFace sf = 
    if (getSubFaceCoDim sf == 1)
    then (sf |> subFaceLI.toL |> List.indexedMap (Tuple.pair >> Maybe.map )
         |> List.filterMap identity |> List.head)
    else Nothing

toFaceForce : SubFace -> Maybe Face
toFaceForce sf = 
   (sf |> subFaceLI.toL |> List.indexedMap (Tuple.pair >> Maybe.map )
         |> List.filterMap identity |> List.head)        

toSubFaceRest : SubFace -> List (Int , Bool)
toSubFaceRest sf = (sf |> subFaceLI.toL |> List.indexedMap (Tuple.pair >> Maybe.map )
         |> List.filterMap identity |> List.drop 1)
                
pieceFlip : Int -> Piece -> Piece
pieceFlip i  =
    let (t , f) = isoPiece
    in f >> (Tuple.mapFirst
                 (mapAsList subsetLI (mapAt i not))
                 
            ) >> t                      

isoPiece : Iso (Subset , Permutation) Piece
isoPiece =
    Tuple.pair
        (\(Subset d i , Permutation _ j) -> Piece d i j)
        (\(Piece d i j) -> (Subset d i , Permutation d j) )    

pieceLI : ListInterpretable Piece (Bool , Int)
pieceLI = prodLI subsetLI permutationLI isoPiece          
            
            
-- Face

allFaces : Int -> List (Face)
allFaces n = List.range 0 ((2 * n) - 1)
                    |> List.map (\x -> (x//2 , (modBy 2 x == 1) ))           

tabulateFaces : Int -> (Face -> x) -> List (Face , x)
tabulateFaces n f =
    (range (2 * n))
   |> List.map
       ((\x -> (x // 2 , modBy 2 x > 0 )) >> doAndPairR f)

tabulateLIMaybe : ListInterpretable a aa -> Int -> (a -> Maybe x) -> (List (a , x))
tabulateLIMaybe li n f =
       (\a -> f a |> Maybe.map (Tuple.pair a)) 
    |> mapAllLI li n
    |> List.filterMap identity  
                  
tabulateSubFaces : Int -> (SubFace -> Maybe x) -> List (SubFace , x)
tabulateSubFaces = tabulateLIMaybe subFaceLI


           
-- -- untested!           
-- subFaceToMaybeFace : SubFace -> Maybe Face
-- subFaceToMaybeFace =
--     subFaceLI.toL
--     >> List.indexedMap (Tuple.pair >> Maybe.map )    
--     >> List.filterMap identity
--     >> Just    
--     >> filterMaybe (List.length >> todo "" )--(isEqual 1))
--     >>  Maybe.andThen (List.head)

faceToSubFace : Int -> Face -> SubFace
faceToSubFace n (i , b) =
    listInsert i (Just b) (List.repeat (n - 1) Nothing)  
    |> subFaceLI.fromL

unTabulate : a -> List a -> Int -> a      
unTabulate a la i =
    case (i , la) of
        (_ , []) -> a
        (0 , _) -> a
        (_ , (x :: xs)) -> unTabulate x xs (i - 1)
                        
    
ambFnOnArr : ((Int -> a) -> (Int -> a)) -> List a -> List a
ambFnOnArr f l =
    case l of
        [] -> []
        x :: xs -> List.map
                   (f (unTabulate x xs ))
                   (range (List.length l))      
                   
subset1 : Bool -> Subset
subset1 = boolElim 0 1 >> Subset 1            

rangeFloat : Int -> Float -> Float -> List Float
rangeFloat n x0 x1 =
     range (n + 1)
  |> List.map (toFloat)
  |> List.map (\x -> x0 + (x1 - x0) * (x / (toFloat n) ))               


---- Zone

-- zoneLI : ListInterpretable Zone ((Bool , Int) , (Maybe Bool))  
-- zoneLI = todo ""

         
-- isoZone : Iso (Piece , SubFace) Zone
-- isoZone = todo ""

-- Subface

-- subfaceElim : (Face -> a -> a) -> SubFace -> a -> a
-- subfaceElim = todo ""              

subFaceCases : SubFace -> Maybe SubFace               
subFaceCases sf =
    if ((subFaceLI.toL sf) |> List.filterMap identity |> List.isEmpty)
    then Nothing
    else Just sf    

subFaceCenter n = ((List.repeat n Nothing) |> subFaceLI.fromL)        

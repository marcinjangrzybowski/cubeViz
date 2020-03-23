module MicroAgda.StringTools exposing (..)


import Dict as Dict exposing (Dict)
import Set as Set exposing (Set)

import ResultExtra exposing (..)



indent : Int -> String -> String
indent i =
    String.split "\n"
    >> List.map (\s -> ((String.join "" (List.repeat i " ")) ++ s))
    >> String.join "\n" 
        
splitNameNumStep : (List Char , String) -> (List Char , String) 
splitNameNumStep (lc , li) =
    case lc of
        [] -> ([] , li)
        x :: xs -> if (Char.isDigit x)     
                     then splitNameNumStep (xs , (String.fromChar x) ++ li)
                     else (lc , li)
                         
splitNameNum : String -> (String , Int)
splitNameNum s =
    let rs = List.reverse (String.toList s) in
    let (ss , li) = splitNameNumStep (rs , "") in
    (String.fromList (List.reverse ss) , Maybe.withDefault 0 (String.toInt li) )
                 
makeFresh2 : (String , Int) -> Set String -> String
makeFresh2 (s , i) l =
    let actual = s ++ (String.fromInt i) in
    if (Set.member actual l)
      then makeFresh2 (s , i + 1) l
      else actual    
             
makeFresh : String -> Set String -> String
makeFresh x l = if Set.member x l
                then makeFresh2 (splitNameNum x) l
                else x   

makeFreshDict : Set String  -> Dict String String
makeFreshDict l = Set.foldl
                  (\s -> \d ->
                       Dict.insert
                         s
                         (makeFresh s  (Set.union l (Dict.values d |> Set.fromList ) ))
                         d
                   )
                  Dict.empty l               

dictSubst : Dict String String -> String -> String
dictSubst di s = Maybe.withDefault s (Dict.get s di)            

-- ctxView2String :
-- ctxView2String =


absPreview : List String -> String 
absPreview = (List.indexedMap (\i -> \s -> "(" ++ (String.fromInt i) ++ ":" ++ s ++ ")"))
             >> String.join ""   

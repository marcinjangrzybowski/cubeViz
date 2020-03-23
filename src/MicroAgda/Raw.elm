module MicroAgda.Raw exposing (..)

import Debug exposing (..)

import MicroAgda.Internal.Term exposing (buildInNamesSet)

import Set exposing (..)

import Dict as Dict

import MicroAgda.StringTools exposing (..)    


type alias FaceExpr = List (Raw , Bool)

type alias PartialCase = (FaceExpr , Raw)    


    
type Raw =
   Pi String Raw Raw
 | Lam String Raw
 | LamP (List PartialCase )   
 | Var String 
 | App Raw Raw


   
   

mapPartialCase : (Raw -> Raw) -> (List PartialCase ) -> (List PartialCase )
mapPartialCase f = List.map (Tuple.mapBoth (List.map (Tuple.mapFirst f) ) f ) 
                 
freeVarsPC : PartialCase -> Set String
freeVarsPC (fe , r) =
     List.foldl
         (\(x , _) -> freeVars x |> union )
         (freeVars r)
         fe  
        
             
freeVars : Raw -> Set String 
freeVars r =
    case r of
       Pi s r1 r2 -> union (freeVars r1) (remove s (freeVars r2))
       Lam s r1 -> (remove s (freeVars r1))
       LamP lpc  -> List.foldl (\x -> freeVarsPC x |> union )  empty lpc  
       Var s  -> singleton s
       App r1 r2 -> union (freeVars r1) (freeVars r2) 

ifTputIntoP : Bool -> String -> String
ifTputIntoP b x =
    case b of
        False -> x
        True -> "( " ++ x ++ " )"               


lamPCase2String : (FaceExpr , Raw) -> String
lamPCase2String (fe , b) =
    "( " ++ (String.join ")(" (List.map (\(iE , i) -> (raw2String iE ) ++ " = " ++ if i then "i1" else "i0") fe ))
    ++ " )" ++ " → " ++ (raw2String b)                  


raw2StringHlpAgda : Bool -> Raw -> String
raw2StringHlpAgda onRight x =
    case x of
        Pi a b c -> "∀ (" ++ a ++ " : " ++ raw2String b ++ ") → " ++ raw2String c
        Lam a c ->
            "λ " ++ a ++ " → " ++ raw2String c |> ifTputIntoP True           
        Var a -> a
        -- (App (Var "~") (Var a)) ->
        --     ("~" ++ a)

        App (App (App (Var "hcomp") a) b) c ->
            "(hcomp {"++ raw2String a ++"} {"++ raw2String b++"} {"++raw2String c ++"} )"
        App (App (App (Var "hfill") a) b) c ->
            "(hfill {"++ raw2String a ++"} {"++ raw2String b++"} {"++raw2String c ++"} )"
        App (App (App (Var "inS") a) b) c ->
            "(inS {"++ raw2String a ++"} {"++ raw2String b++"} {"++raw2String c ++"} )"
        App (App (App (App (Var "outS") a) b) c) d ->
            "(outS {"++ raw2String a ++"} {"++ raw2String b++"} {"++raw2String c ++"} {"++raw2String d ++"} )"
        -- App (App (App (App (Var "outS") a) b) c) d ->
        --     "(outS)"                
        App (App (Var "Max") a) b ->
            ifTputIntoP onRight (raw2StringHlp True a ++ " ∨ " ++ raw2String b)
        App (App (Var "Min") a) b ->
            ifTputIntoP onRight (raw2StringHlp True a ++ " ∧ " ++ raw2String b)        
            
        App a b ->
            ifTputIntoP onRight (raw2String a ++ " " ++ raw2StringHlp True b)
        LamP l -> 
            indent 3 ("\n(λ {\n   "
                ++ (indent 6 (String.join "\n ; " (List.map lamPCase2String l)))
                ++ "\n   })\n")        
        
raw2StringHlp : Bool -> Raw -> String
raw2StringHlp onRight x =
    case x of
        Pi a b c ->
            "∀ (" ++ a ++ " : " ++ raw2String b ++ ") → " ++ raw2String c
        Lam a c ->
            "λ " ++ a ++ " → " ++ raw2String c |> ifTputIntoP True           
        Var a -> a
        -- (App (Var "~") (Var a)) ->
        --     ("~" ++ a)         
        App (App (Var "Max") a) b ->
            ifTputIntoP onRight (raw2StringHlp True a ++ " ∨ " ++ raw2String b)
        App (App (Var "Min") a) b ->
            ifTputIntoP onRight (raw2StringHlp True a ++ " ∧ " ++ raw2String b)        
            
        App a b ->
            ifTputIntoP onRight (raw2String a ++ " " ++ raw2StringHlp True b)
        LamP l -> 
            indent 3 ("\n(λ {\n   "
                ++ (indent 6 (String.join "\n ; " (List.map lamPCase2String l)))
                ++ "\n   })\n")        

                
raw2String : Raw -> String
raw2String = (raw2StringHlpAgda False)                     

                    
                   
isAgdaNameChar : Char -> Bool
isAgdaNameChar c = Char.isAlphaNum c || (List.member c ['ℓ','φ','~','-','=',':','\'' , 'α' , 'β'])                

renameAbsDIns : Dict.Dict String String -> Set String -> Raw -> Raw
renameAbsDIns di se r =
   let ria : (String -> Raw -> Raw) -> String -> Raw -> Raw
       ria h ss rr =
           case (Dict.get ss di) of
             Just ss2 -> h ss2 (renameAbsDIns di (Set.insert ss se) rr)
             Nothing ->  h ss (renameAbsDIns di se rr)           
   in          
   case r of
       Pi s r1 r2 -> ria (\sA -> \r2A -> Pi sA (renameAbsDIns di se r1) r2A) s r2
       Lam s r1 -> ria Lam s r1
       LamP lpc  -> LamP (mapPartialCase (renameAbsDIns di se) lpc)  
       Var s  -> Var (if (member s se) then dictSubst di s else s)
       App r1 r2 -> App
                    (renameAbsDIns di se r1)
                    (renameAbsDIns di se r2)  
                
renameAbsD : Dict.Dict String String -> Raw -> Raw                   
renameAbsD di = renameAbsDIns di (Set.empty)

fixAbsNamesUnsafe : Set String -> Raw -> Raw
fixAbsNamesUnsafe defInCtx r =
    let undefs = filter (\x ->
                                     (not (member x defInCtx))
                                  && (not (member x buildInNamesSet ) ))
                         (freeVars r) in
    (renameAbs (union defInCtx buildInNamesSet)  r )
    
                     
fixAbsNames : Set String -> Raw -> Result String Raw
fixAbsNames defInCtx r =
    let undefs = filter (\x ->
                                     (not (member x defInCtx))
                                  && (not (member x buildInNamesSet ) ))
                         (freeVars r) in
    if isEmpty undefs
    then Ok (renameAbs (union defInCtx buildInNamesSet)  r )
    else Err (foldl (\x -> \y -> x ++ ", " ++ y) "Undefined: " (undefs) )
                
renameAbs : Set String -> Raw -> Raw                   
renameAbs = makeFreshDict >> renameAbsD
             
substUnsafe : String -> Raw -> Raw -> Raw
substUnsafe sym x r =
    let f = substUnsafe sym x in
    case r of
       Pi s r1 r2 -> Pi s (f r1) (f r2)
       Lam s r1 -> Lam s (f r1)
       LamP lpc -> LamP (List.map
                             (\(lf , b) ->
                                       ((List.map (\(fe , bl) -> (f fe , bl)) lf) , f b))
                         lpc)  
       Var s  -> if (s == sym) then x else Var s
       App r1 r2 -> App (f r1) (f r2)           

subst : String -> Raw -> Raw -> Raw                    
subst s x = (freeVars x |> renameAbs) >> substUnsafe s x           



toTailForm : Raw -> (Raw , List Raw)            
toTailForm r =
    case r of
       App x y -> let ( h , t ) = (toTailForm x)
                  in (h , List.append t [y])                      
       x -> (x , [])

whnfTF :  (Raw , List Raw) -> (Raw , List Raw)
whnfTF tf =
    case tf of 
        ((Lam s r1) , r2 :: tl) ->
            let (h , tl2) = whnf (subst s r2 r1)
            in whnfTF (h , (List.append tl2 tl))   
        x -> x
             
whnf : Raw -> (Raw , List Raw)
whnf = toTailForm >> whnfTF
-- whnf : Raw -> (Raw , List Raw)
-- whnf r =
--     case r of       
--        App (Lam s r1) r2 -> whnf (subst s r2 r1)
--        App x y -> let ( h , t ) = (whnf x)
--                   in (h , List.append t [y])                      
--        x -> (x , [])              

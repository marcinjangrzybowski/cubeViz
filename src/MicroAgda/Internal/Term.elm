module MicroAgda.Internal.Term exposing
    ( .. )

import Debug exposing (..)

import Dict 

import Set exposing (..)

import MicroAgda.Internal.ArgInfo as AI exposing (ArgInfo)

import MicroAgda.Sort exposing (..)

import Either exposing (..)

import ResultExtra exposing (..)

type alias Arg a = {
         argInfo : ArgInfo 
       , unArg : a
      }       
    
argMap : (a -> a) -> Arg a -> Arg a
argMap f x = {x | unArg = f (x.unArg) }     
-- argName : Arg a -> String
-- argName x = AI.toString (x.argInfo)           
    
type alias Dom d = {
         domInfo : ArgInfo
       , domName : Maybe String     
       , unDom : d
      }   

swapDom : Dom d -> d -> Dom d
swapDom d e = { d | unDom = e }          

domMap : (a -> a) -> Dom a -> Dom a
domMap f x = {x | unDom = f (x.unDom) }     

domMapResult : (a -> Result e a) -> Dom a -> Result e (Dom a)
domMapResult f x = (f (x.unDom)) |> Result.map (\y -> swapDom x y)                               
   
    
type alias Abs a =  {  absName : String , unAbs : a }
--           | NoAbs { absName : String , unAbs : a }


notAbs : a -> Abs a
notAbs a = {  absName = "unnamed" , unAbs = a }

yesAbs : String -> a -> Abs a
yesAbs s a = {  absName = s , unAbs = a }
           
toDom : a -> Dom a
toDom a = {
         domInfo = AI.default
       , domName = Nothing     
       , unDom =  a
      }        
           
absMap : (a -> b) -> Abs a -> Abs b
absMap f x = {unAbs = f (x.unAbs) , absName = x.absName }

absMapResult : (a -> Result e a) -> Abs a -> Result e (Abs a)
absMapResult f x = (f (x.unAbs)) |> Result.map (\y -> absMap (\_ -> y) x)    
             
type alias Type = Term

type alias SubFace = List (Term , Bool)
    
type alias PartialCase = {subFace : SubFace , body : Term}
                 
type alias PartialCases = List PartialCase

    
type BuildInToken = Univ | Level | SucLevel | Interval | I0 | I1 | Max | Min | Neg
                  | Level0 | Partial | IsOne | OneIsOne | Sub | Hcomp | OutS | PathP | InS 


buildInToken2String : BuildInToken -> String
buildInToken2String b =
    case b of
        Univ -> "Type"
        Level -> "Level"
        Level0 -> "ℓ-zero"         
        SucLevel -> "ℓ-suc"
        Interval -> "I"
        I0 -> "i0"
        I1 -> "i1"
        Max -> "Max"
        Min -> "Min"
        Neg -> "~" 
        Partial -> "Partial"        
        IsOne -> "IsOne"
        OneIsOne -> "1=1"
        Sub -> "Sub"            
        Hcomp -> "hcomp"
        OutS -> "outS"         
        PathP -> "PathP"
        InS -> "inS"         
                   
buildInTokensList = [
                      ("Level" , {bit = Level , ty = Star })  
                   ,  ("Type" , { bit = Univ
                              , ty = (Pi (toDom ((Def (BuildIn Level) []))) (notAbs Star))
                                })
                   , ("ℓ-zero" , { bit = Level0
                               , ty = (Def (BuildIn Level) [])
                                 })
                     , ("I" , {bit = Interval , ty = Star })
                    , ("i0" , { bit = I0
                               , ty = (Def (BuildIn Interval) [])
                                 })
                    , ("i1" , { bit = I1
                               , ty = (Def (BuildIn Interval) [])
                                 })
                    , ("Max" , { bit = Max
                               , ty = (Pi (toDom ((Def (BuildIn Interval) []))) (notAbs (Pi (toDom ((Def (BuildIn Interval) []))) (notAbs (Def (BuildIn Interval) [])))))
                                 })
                     , ("Min" , { bit = Min
                               , ty = (Pi (toDom ((Def (BuildIn Interval) []))) (notAbs (Pi (toDom ((Def (BuildIn Interval) []))) (notAbs (Def (BuildIn Interval) [])))))
                                 })
                     , ("~" , { bit = Neg
                               , ty = (Pi (toDom ((Def (BuildIn Interval) []))) (notAbs (Def (BuildIn Interval) [])))
                                 })
                     , ("Partial" , { bit = Partial
                               , ty = (Pi (toDom ((Def (BuildIn Level) [])))
                                           (notAbs (Pi (toDom ((Def (BuildIn Interval) [])))
                                               (notAbs (Pi (toDom (Star))
                                                        (notAbs (Star)))))))
                                 })
                      , ("IsOne" , { bit = IsOne
                               , ty =  (Pi (toDom ((Def (BuildIn Interval) [])))
                                               (notAbs (Star)))
                                 })
                      , ("1=1" , { bit = OneIsOne
                               , ty = Def (BuildIn IsOne) [elim (Def (BuildIn I1) [] )]  
                                 })
                       , ("Sub" , { bit = Sub
                               , ty = mkPi (buildIn Level)
                                      (notAbs (
                                              mkPi ( Star)
                                                 (yesAbs "A" (
                                                         mkPi (buildIn Interval)
                                                        (yesAbs "φ" (
                                                         mkPi (
                                        mkPi (Def (BuildIn IsOne) [elim (Var 0 [])]) (notAbs (Var 2 []))
                                                              ) (notAbs (Star))
                                                      ))
                                                )) 
                                             ))
                                        
                                 })
                               , ("outS" , { bit = OutS
                               , ty = mkPi (buildIn Level)
                                      (yesAbs "l" (
                                              mkPi ( Star)
                                                 (yesAbs "A" (
                                                         mkPi (buildIn Interval)
                                                        (yesAbs "φ" (
                                                         mkPi (
                                        mkPi (Def (BuildIn IsOne) [elim (Var 0 [])]) (notAbs (Var 2 []))
                                                              ) (yesAbs "u" (
                                                                    mkPi
                                                                        (Def (BuildIn Sub)
                                                                             [
                                                                              elim (Var 3 [])
                                                                              ,elim (Var 2 [])
                                                                              ,elim (Var 1 [])
                                                                              ,elim (Var 0 [])    
                                                                             ])
                                                                        (notAbs (Var 3 []))

                                                                        ))
                                                      ))
                                                )) 
                                             ))
                                        
                                 }) ,
                           ("inS" , { bit = InS
                               , ty = mkPi (buildIn Level)
                                      (yesAbs "l" (
                                              mkPi ( Star)
                                                 (yesAbs "A" (
                                                         mkPi (buildIn Interval)
                                                        (yesAbs "φ" (
                                                         mkPi (
                                        Var 1 []
                                                              ) (yesAbs "a" (
                                                                    
                                                                        (Def (BuildIn Sub)
                                                                             [
                                                                              elim (Var 3 [])
                                                                              ,elim (Var 2 [])
                                                                              ,elim (Var 1 [])
                                                                              , elim ( mkLam
                                                           (Def (BuildIn IsOne) [elim (Var 1 [])])  
                                                                                      (notAbs
                                                                                       (Var 0 []))
                                                                                     )    
                                                                             ])
                                                                        

                                                                        ))
                                                      ))
                                                )) 
                                             ))
                                        
                                 })
                           , ("hcomp" , { bit = Hcomp
                               , ty = mkPi (buildIn Level)
                                      (yesAbs "l" (
                                              mkPi ( Star)
                                                 (yesAbs "A" (
                                                         mkPi (buildIn Interval)
                                                        (yesAbs "φ" (
                                                         mkPi (
                                                               
                                      mkPi (buildIn Interval)  (notAbs (mkPi (Def (BuildIn IsOne) [elim (Var 1 [])]) (notAbs (Var 3 []))))
                                                              ) (notAbs (mkPi (Var 2 []) (notAbs (Var 3 [])) ))
                                                      ))
                                                )) 
                                             ))
                                        
                                 })
                               , ("PathP" , { bit = PathP
                               , ty = mkPi (buildIn Level)
                                      (yesAbs "l" (
                                              mkPi ( mkPi (buildIn Interval) (notAbs Star) )
                                                 (yesAbs "A" (
                                                         mkPi ( Var 0 [ elim (Def (BuildIn I0) [] )])
                                                        (notAbs (
                                                         mkPi ( Var 1 [ elim (Def (BuildIn I0) [] )])
                                                             (notAbs (Star))
                                                      ))
                                                )) 
                                             ))
                                        
                                 })
                    ]
-- {ℓ = ℓ₁ : Level} {A = A₁ : Set ℓ₁} {φ : I} (x : A₁) → Sub A₁ φ (λ _ → x)
type BIView =
    JB BuildInToken
  | JB1 BuildInToken BIView
  | JB2 BuildInToken BIView BIView
  | JB4 BuildInToken BIView BIView BIView BIView 
  | JT Term

tmBIView : Term -> BIView 
tmBIView e =
    case e of
        Def (BuildIn bi) [] -> JB bi
        Def (BuildIn bi) [x] -> JB1 bi (toBIView x)
        Def (BuildIn bi) [x , y] -> JB2 bi (toBIView x) (toBIView y)
        Def (BuildIn bi) [x , y , z , q]
            -> JB4 bi (toBIView x) (toBIView y) (toBIView z) (toBIView q)                            
        (t) -> JT t 
  
toBIView : Elim Term -> BIView 
toBIView e =
    case (elimArg e) of
        Def (BuildIn bi) [] -> JB bi
        Def (BuildIn bi) [x] -> JB1 bi (toBIView x)
        Def (BuildIn bi) [x , y] -> JB2 bi (toBIView x) (toBIView y)
        Def (BuildIn bi) [x , y , z , q]
            -> JB4 bi (toBIView x) (toBIView y) (toBIView z) (toBIView q)                            
        (t) -> JT t

fromBIView : BIView -> Term
fromBIView bv =
    case (bv) of
        JB bi ->  (Def (BuildIn bi) [])
        JB1 bi biv ->  (Def (BuildIn bi) [elim (fromBIView biv)])
        JB2 bi biv1 biv2 ->  (Def (BuildIn bi) [elim (fromBIView biv1) , elim (fromBIView biv2)])
        JB4 bi biv1 biv2 biv3 biv5 ->
             (Def (BuildIn bi) [elim (fromBIView biv1)
                               , elim (fromBIView biv2)
                               , elim (fromBIView biv3)
                               , elim (fromBIView biv3)
                               ])
        (JT tm) -> tm

nfBImayFail : BuildInToken -> Elims -> Result String Term 
nfBImayFail bi ee = 
    case (bi , List.map toBIView ee) of
         --(Neg , [(JB2 Max x y)]) -> (nfBi (buildIn Min) (buildIn Min)) 
         ( _ ) -> Ok (Def (BuildIn bi) ee)

   
                        
minListLike : Listlike BIView BIView                                   
minListLike = {
     cons = JB2 Min
   , trunk = \x -> x
   , head = \biv ->
         case biv of
             (JB2 Min y z) -> y
             y -> y
   , tail = \biv -> case biv of
             (JB2 Min y z) -> Just z
             y -> Nothing
 }

maxListLike : Listlike BIView BIView                                   
maxListLike = {
     cons = JB2 Max
   , trunk = \x -> x
   , head = \biv ->
         case biv of
             (JB2 Max y z) -> y
             y -> y
   , tail = \biv -> case biv of
             (JB2 Max y z) -> Just z
             y -> Nothing
 }    
    
              
isCompBIV : BIView -> Bool
isCompBIV biv = 
    case biv of
        (JB1 Neg  x) -> isCompBIV x                    
        (JT (Def (FromContext i) [])) -> True
        (JT (Var i [])) -> True
        _ -> False             
             
compBIV :  Comparator BIView 
compBIV l r =
    case (isCompBIV l , isCompBIV r) of
        (True , False) -> Cgt
        (False , True) -> Clt
        (True , True) ->                   
              case (l , r) of
                  (JB1 Neg  x , JB1 Neg y) -> (compBIV x y) 
                  (JB1 Neg  x , JT y) -> compSwitch (compBIV r l) 
                  (JT x , JB1 Neg  y) -> case (compBIV (JT x) (y)) of
                                            Ceq -> Cgt 
                                            Clt -> Clt
                                            Cgt -> Cgt           
                  (JT (Def (FromContext i) []) , JT (Def (FromContext j) [])) -> compareInts j i
                  (JT (Var i []) , JT (Var j [])) -> compareInts i j
                  (JT (Def (FromContext _) []) , JT (Var _ [])) -> Cgt
                  (JT (Var _ []) , JT (Def (FromContext _) [])) -> Clt
                  _ -> Cgt                                                 
        (False , False) -> Cgt
             
minDepth :  BIView -> Int
minDepth biv =
    case biv of
        (JB I1) -> 0
        (JB2 Min y z) -> 1 + (minDepth z)
        _ -> 1
                 
isNotUnder : BIView -> BIView -> Bool
isNotUnder u d =
    let m = minListLike in
    case (compareBy minDepth compareInts u d) of
        Cgt -> (minDepth (minRed u d)) > minDepth u 
        _ -> True    
            
pushMax : BIView -> BIView -> BIView              
pushMax h t = 
    let m = maxListLike in
    let ht = m.head t in
    let c = compareBy minDepth compareInts |> thenCompare (lexiSort compBIV minListLike) in
    case (c h ht) of
        --_ -> m.cons h t
        Cgt -> cons2FromMaybe m h (list2filter m (isNotUnder h) t)
        Ceq -> t
        Clt -> if (isNotUnder ht h)
               then (m.tail t)
                   |> Maybe.map (pushMax h)
                   |> Maybe.withDefault (m.trunk h )
                   >> (m.cons ht)    
               else t

minRed : BIView -> BIView -> BIView 
minRed x y =
    let m = minListLike in
    (sortListlike compBIV m (concatListlike m x y))
         
maxRed : BIView -> BIView -> BIView 
maxRed l =
    let m = maxListLike in
    pushMax (m.head l) >> ( m.tail l |> Maybe.map maxRed |> Maybe.withDefault (\x -> x))
           
    
          
nfBI : BuildInToken -> Elims -> Term 
nfBI bi ee = 
    case (bi , List.map toBIView ee) of
         (Univ , _ :: []) -> Star
         (Partial , _ :: phi0 :: ty0  :: []) ->
             let phi = fromBIView phi0 in
             let ty = fromBIView ty0 in
              mkPi (Def (BuildIn IsOne) [elim phi]) (notAbs (ty))

         (Hcomp , _ :: _ :: (JB I1)  :: JT (Lam aa bb)  :: _ :: [])
             -> nfApp (Lam aa bb) [ elim (buildIn I1) , elim (buildIn OneIsOne) ]
                |> Result.withDefault (Def (BuildIn Hcomp) ee)
         (OutS , _ :: _ :: _ :: _ :: (JB4 InS _ _ _ y) :: [])
             -> fromBIView y
--         negation                    
         (Neg , (JB I0) :: []) -> (Def (BuildIn I1) [])
         (Neg , (JB I1) :: []) -> (Def (BuildIn I0) [])

         -- double negation                               
         (Neg , [(JB1 Neg x)]) -> fromBIView x
                                  
          -- bounded laws                        
         (Min , (JB I0) :: (_) :: []) -> (Def (BuildIn I0) [])
         (Min , (_) :: (JB I0) :: []) -> (Def (BuildIn I0) [])
         (Max , (JB I1) :: (_) :: []) -> (Def (BuildIn I1) [])
         (Max , (_) :: (JB I1) :: []) -> (Def (BuildIn I1) [])

         -- identity laws                               
         (Max , (JB I0) :: (x) :: []) -> fromBIView x
         (Max , (x) :: (JB I0) :: []) -> fromBIView x
         (Min , (JB I1) :: (x) :: []) -> fromBIView x
         (Min , (x) :: (JB I1) :: []) -> fromBIView x

                                         

         -- De Morgan involution
         (Neg , [(JB2 Max x y)]) ->
             (nfBI Min [
                      (elim (nfBI Neg ([elim (fromBIView x)])))
                    , (elim (nfBI Neg ([elim (fromBIView y)])))
                     ])
         (Neg , [(JB2 Min x y)]) ->
             (nfBI Max [
                      (elim (nfBI Neg ([elim (fromBIView x)])))
                    , (elim (nfBI Neg ([elim (fromBIView y)])))
                     ])


          -- distributive
         (Min , [(JB2 Max x y) , z]) ->
             (nfBI Max [
                      (elim (nfBI Min ([elim (fromBIView x) , elim (fromBIView z)])))
                    , (elim (nfBI Min ([elim (fromBIView y) , elim (fromBIView z)])))
                     ])
         (Min , [x , (JB2 Max y z)]) ->
             (nfBI Max [
                      (elim (nfBI Min ([elim (fromBIView x) , elim (fromBIView y)])))
                    , (elim (nfBI Min ([elim (fromBIView x) , elim (fromBIView z)])))
                     ])

         -- tail-to-right MIN       
         -- combine sort and concat indo more efficient function          
         (Min , [x , y]) ->
            fromBIView (minRed x y)         

         (Max , [x , y]) ->
            fromBIView (maxRed x y)         
                
                 

          -- no more redexes        
         ( _ ) -> (Def (BuildIn bi) ee)
            -- nfBImayFail bi ee
            -- |> Result.withDefault (Def (BuildIn bi) ee)
                   

-- subFaceSubstBody : SubFace -> Term ->  Result String Term
-- subFaceSubstBody sf t = List.foldl (\(x , b) -> Result.andThen (substI x b)  ) (Ok t) sf


-- TODO applying bounds to body on this stagex
partialCase : SubFace -> Term -> PartialCase
partialCase sf b = {subFace = sf , body = b}                   
                   
pushPartialCase : PartialCase -> PartialCases -> PartialCases
pushPartialCase x l =
    case l of
        [] -> [x]
        h :: t ->
            let ff = \y -> toBIView (elim (subFace2Term (y.subFace))) in
            let hh = ff h in
            let xx = ff x in
            let c = compareBy minDepth compareInts |> thenCompare (lexiSort compBIV minListLike) in
            case (c xx hh)  of
                Ceq -> l
                Clt -> x :: (List.filter (\q -> isNotUnder (ff q) xx ) l )
                Cgt -> if (isNotUnder xx hh)
                       then h :: (pushPartialCase x t)     
                       else l
                       
partialCases : List (PartialCase) -> PartialCases
partialCases = List.foldl pushPartialCase []

collectPartialPhi : List (PartialCase) ->  Term
collectPartialPhi = (List.map ((\x -> subFace2Term (x.subFace))))
                    >> (List.foldr (mkMax) (mkIEnd False))              
    
buildInTokensDict = Dict.fromList buildInTokensList
                    
    
buildInLookup : String -> Maybe (BuildInToken , Type)
buildInLookup s =
    Maybe.map (\x -> (x.bit , x.ty)) (Dict.get s buildInTokensDict)

buildInNamesSet : Set String
buildInNamesSet = ("TypeInf" :: List.map Tuple.first buildInTokensList |> fromList)
    
buildIn : BuildInToken -> Term
buildIn bin = Def (BuildIn bin ) [] 

                
type Defined = FromContext Int | BuildIn BuildInToken        

    
type alias IVatom = (Int , Bool)
    
type alias IVmin = List IVatom    

type alias IVterm = List IVmin
    
type IntervalView = IV IVterm | Ot Term

ifErr : Result e a -> Result e a -> Result e a     
ifErr spare def =
    case def of
        Ok a -> Ok a
        Err e -> spare
                 
type alias PiData = ((Dom Type) , (Abs Type))
type alias PathData = (Term , Term )    
                 
type Term =
 Pi (Dom Type) (Abs Type)
 | Lam ArgInfo (Abs Term)
 | LamP PartialCases Elims  
 | Var Int Elims
 | Def Defined Elims  
 | Star  


toPiData : Term -> Maybe PiData
toPiData t =
    case t of
        Pi x y -> Just (x , y)
        Def (BuildIn PathP) (_ :: a :: a0 :: a1 :: []) ->
            mkApp (elimArg a) (Var 0 [])
            |> Result.map (\q -> ( toDom mkInterval , (yesAbs "iii" q)))
            |> Result.toMaybe    
        _ -> Nothing

toPathData : Term -> Maybe PathData
toPathData t =
    case t of
        Def (BuildIn PathP) (_ :: a :: a0 :: a1 :: []) ->
            mkApp (elimArg a) (Var 0 [])
            |> Result.map (\q ->
                   (elimArg a0 , elimArg a1))
            |> Result.toMaybe  
             
        _ -> Nothing                          

toIsOne : Term -> Maybe Term
toIsOne t =
    case (tmBIView t) of
        JB1 IsOne x -> Just (fromBIView x)
        _ -> Nothing    
          
piApp : PiData -> Term -> Result String Type
piApp (_ , at) arg = absApply at arg              
             
type Elim a = Apply (Arg a) | IApply a a a

subTermsElim : Elim a -> List a
subTermsElim e = case e of
                     Apply a -> [ a.unArg ]
                     IApply a1 a2 a3 -> [ a1 , a2 , a3 ]

elimArg : Elim a -> a
elimArg e = case e of
                     Apply a -> a.unArg
                     IApply _ _ a -> a          
                                        
type alias Elims = List (Elim Term)
    

getTail : Term -> Elims
getTail tm =
    case tm of
           LamP pcs ee -> ee
           Lam ai b -> []         
           Var i ee -> ee
           Def (FromContext j) ee -> ee
           Def (BuildIn bi) ee -> ee
           Pi _ _ -> []
           Star -> []  

    
    
subTerms : Term -> List Term 
subTerms t =
    case t of
        LamP pcs ee -> let inp = List.concat
                                 (List.map
                                      (\pc -> pc.body :: (List.map Tuple.first pc.subFace ) ) pcs)
                       in List.append inp (List.concat (List.map subTermsElim ee))            
        Lam _ b -> [ b.unAbs ]           
        Var _ ee -> List.concat (List.map subTermsElim ee)
        Def _ ee -> List.concat (List.map subTermsElim ee)
        Pi td tb -> [ td.unDom , tb.unAbs ]
        Star -> [] 

termTraverse : (Term -> a -> a) -> a -> Term -> a 
termTraverse f a t = List.foldl f (f t a) (subTerms t)  

elimMap : (a -> a) -> Elim a -> Elim a
elimMap f y =
    case y of
        Apply a -> Apply (argMap f a)
        IApply a0 a1 a -> IApply (f a0) (f a1) (f a)

                          
elimMapResult : (a -> Result String a) -> Elim a -> Result String (Elim a)                          
elimMapResult f y =
    case y of
        Apply a -> f a.unArg
                |> (Result.map (\x -> {a | unArg = x}))
                |> (Result.map Apply)
        IApply a0 a1 a -> mapListResult f [a0 , a1 , a]
                          |> Result.andThen
                             (\x -> case x of
                                aa0 ::  aa1 :: aa :: [] -> Ok (IApply aa0 aa1 aa)
                                _ -> Err "Imposible!")
  

elimsMap : (Term -> Term) -> Elims -> Elims
elimsMap f = List.map (elimMap f)                                     
          
mkUniv : Type
mkUniv = Star

elim : a -> Elim a 
elim a = Apply { argInfo = AI.default , unArg = a } 


mkPartial : Term -> (Term) -> Term 
mkPartial fTm bTm =
    subFace fTm  
    |> List.map (\x -> partialCase x bTm)
    |> partialCases |> (\x -> LamP x [])   


pathAppElim : Term -> (Result String Term)
pathAppElim tm =
    getTail tm
    |> pathAppElimInElims
    |> Maybe.withDefault (Ok tm)   

pathAppElimInElims : Elims -> Maybe (Result String Term)
pathAppElimInElims es =
    case es of
        IApply e0 e1 (Def (BuildIn pe) []) :: rest ->
            case pe of
                I0 -> Just (nfApp e0 rest) 
                I1 -> Just (nfApp e1 rest)
                _ -> pathAppElimInElims rest
        _ :: rest -> pathAppElimInElims rest             
        _ -> Nothing


             
nfApp : Term -> Elims -> Result String Term
nfApp h t =
    (pathAppElimInElims t)
        -- Nothing
    |> Maybe.withDefault (
       case h of
           LamP pcs ee -> lamP pcs (List.append ee t)
           Lam ai b -> case t of
                           [] -> Ok (Lam ai b)
                           x :: xs ->
                               absApply b (elimArg x)
                             |> Result.andThen (\y -> nfApp y xs)         
           Var i ee -> Ok (Var i (List.append ee t))
           Def (FromContext j) ee -> Ok (Def (FromContext j) (List.append ee t))
           Def (BuildIn bi) ee -> Ok (nfBI bi (List.append ee t))
           Pi _ _ -> Err "Pi in Head"
           Star -> Err "Star in Head" )       

liftTermIns : Int -> (Int -> Int) -> Term -> Term
liftTermIns b f x =
    case x of
        LamP pcs ee -> LamP (List.map (\pc ->
                                {
                                    subFace = List.map ( Tuple.mapFirst ( liftTermIns b f) ) pc.subFace
                                  , body = liftTermIns b f pc.body    
                                  }) pcs) (elimsMap (liftTermIns b f) ee)
        Lam ai bb -> Lam ai (absMap (liftTermIns (b + 1) f) bb)           
        Var ii ee -> let tail = (elimsMap (liftTermIns b f) ee) in
                     if (ii < b)
                     then Var ii tail
                     else Var (f ii) tail 
        Def n ee -> Def n (elimsMap (liftTermIns b f) ee) 
        Pi td tb -> Pi (domMap (liftTermIns b f) td) (absMap (liftTermIns (b + 1) f) tb)                                      
        Star -> Star
        
              
liftTerm : Int -> Term -> Term
liftTerm i x = if i == 0
               then x
               else (liftTermIns 0 (\y -> i + y) x) 

substElims : Int -> Term -> Elims -> Result String Elims
substElims i x ee = (mapListResult (elimMapResult (subst i x))  ee)

substElimsIC : Int -> Term -> Elims -> Result String Elims
substElimsIC i x ee = (mapListResult (elimMapResult (substIC i x))  ee)

substElimsIC2 : Int -> Term -> Elims -> Result String Elims
substElimsIC2 i x ee = (mapListResult (elimMapResult (substIC2 i x))  ee)                      

type BTypeView = PT Term Term Term | OT Term                      
                    

toBTypeView : Term -> BTypeView
toBTypeView t =
    case t of
        (Def (BuildIn Partial) [x , y , z]) -> PT (elimArg x) (elimArg y) (elimArg z)  
        _ -> OT t 

toPartialCases : Term -> Maybe (List PartialCase)
toPartialCases tm =
    case tm of
        (LamP lpcs []) -> Just lpcs
        _ -> Nothing                  
        
toPartialDom : Term -> Maybe Term 
toPartialDom = toPiData >> Maybe.map (Tuple.second >> (\x -> x.unAbs))

toPartialPhi : Term -> Maybe Term 
toPartialPhi =
    toPiData >> Maybe.map (Tuple.first >> (\x -> x.unDom))
        >> Maybe.andThen
        (\x ->
           case toBIView (elim x) of
               JB1 IsOne y -> Just (fromBIView y)
               _ -> Nothing)

toHcompCases : Term -> Maybe (String , List PartialCase)
toHcompCases ltm =
    case ltm of
       Lam abs bo ->
           case bo.unAbs of
               LamP pcs [] ->
                  Just (bo.absName , pcs)
               _ -> Nothing       
       _ -> Nothing

            
            
-- TODO : shadowoanie nazw argumentow 
substAbs : Int -> Term -> ArgInfo -> Abs Term -> Result String (Abs Term)
substAbs i x ai at = absMapResult (subst (i + 1) x) at

isEmptyFaceIns : List BIView -> Bool
isEmptyFaceIns li =
    case li of
        [] -> False
        (JT (Def (FromContext i) [])) :: (JB1 Neg (JT (Def (FromContext j) []))) :: xs ->
            if i == j
            then True
            else isEmptyFaceIns xs
        (JT (Var i [])) :: (JB1 Neg (JT (Var j []))) :: xs ->
            if i == j
            then True
            else isEmptyFaceIns xs        
        x :: xs -> isEmptyFaceIns xs    
                 
isEmptyFace : Term -> Bool
isEmptyFace t =
    case toBIView (elim t) of
        JB I0 -> True
        x -> isEmptyFaceIns (list2toList (minListLike) (x))          
                  
              
subFace : Term -> (List SubFace)
subFace t = if isEmptyFace t then [] else (subFaceIns t)
    
             
subFaceIns : Term -> List (SubFace)
subFaceIns t = 
    case toBIView (elim t) of
        JB2 Max h tl -> List.append (subFaceIns (fromBIView h)) (subFaceIns (fromBIView tl))
        JB2 Min (JB1 Neg nt) tl -> [ (fromBIView nt , False) ::
                                         (List.concat (subFaceIns (fromBIView tl))) ]
                                
        JB2 Min (h) tl -> [ (fromBIView h , True) ::
                                         (List.concat (subFaceIns (fromBIView tl))) ]               
        JB1 Neg nt -> [[(fromBIView nt , False)]]
        JB I1 -> [[]]
        JB I0 -> []  
        _ -> [[(t , True)]]               

subFace2Term : SubFace -> Term
subFace2Term sf =
    case sf of
       [] -> buildIn I1
       x :: xs ->
            let f : (Term , Bool) -> Term
                f (t , b) = if b then t else (mkNeg t) 
            in mkMin (f x) (subFace2Term xs)  
               
absApply : Abs Term -> Term -> Result String (Term)                 
absApply at x = 
    (subst 0 (liftTerm 1 x) (at.unAbs))
    |> Result.map (liftTerm (-1))

absApplyOnTm : Term -> Term -> Result String (Term)                 
absApplyOnTm t x =
    (subst 0 (liftTerm 1 x) (t))
    |> Result.map (liftTerm (-1))       

mapPartialCases : (Term -> Term) -> PartialCases -> PartialCases
mapPartialCases f =
    List.map (\pc ->
                 (subFace (f (subFace2Term pc.subFace)))
                 |> List.map (\sf -> partialCase sf (f pc.body))
             )
    >> List.concat    
    >> partialCases
                         

mapPartialCasesRes : (SubFace -> Term -> Result String Term)
                       -> PartialCases -> Result String PartialCases
mapPartialCasesRes f =
    mapListResult (\pc ->
                     (f [] (subFace2Term pc.subFace))
                    |> Result.map (subFace )   
                    |> Result.map (List.map (\sf ->
                                            f sf pc.body
                                            |> Result.andThen ( applySubFaceConstr sf )    
                                            |> Result.map (partialCase sf)))                        
             )
       
    >> Result.map List.concat
    >> Result.andThen (mapListResult identity)
    >> Result.map (partialCases)

applySubFaceConstr : SubFace -> Term -> Result String Term
applySubFaceConstr sf t0 = 
    List.foldl
       (\(fc , b) -> Result.andThen (\t ->
            let fi = mkIEnd b in
            case fc of
                Var i [] -> Ok t --subst (i ) fi t
                Def (FromContext i) [] -> substIC2 i fi t
                _ -> Ok t)
       ) (Ok t0) sf
                     
substPartialCases : Int -> Term -> PartialCases -> Result String PartialCases                  
substPartialCases i x = mapPartialCasesRes (\sf -> \tm -> applySubFaceConstr sf x
                                           |> Result.andThen (\x2 -> subst i x2 tm) )
    
substPartialCasesIC : Int -> Term -> PartialCases -> Result String PartialCases                  
substPartialCasesIC i x = mapPartialCasesRes (\sf -> \tm -> applySubFaceConstr sf x
                                           |> Result.andThen (\x2 -> substIC i x2 tm) )

substPartialCasesIC2 : Int -> Term -> PartialCases -> Result String PartialCases                  
substPartialCasesIC2 i x = mapPartialCasesRes (\sf -> \tm -> applySubFaceConstr sf x
                                           |> Result.andThen (\x2 -> substIC2 i x2 tm) )                          
                       
-- DANGER do not use to ctreate PartialCases from List
-- todo PartialCases should be type rather than alias
lamP : PartialCases -> Elims -> Result String Term
lamP x y =
    case (x , y) of
        ((sf :: []) , (_ :: tl)) ->
            case sf.subFace of
                [] -> nfApp sf.body tl
                _ -> Ok (LamP x y)      
        _ -> Ok (LamP x y)
       
subst : Int -> Term -> Term -> Result String Term
subst i x e =
    (case e of
        LamP pcs ee -> (substPartialCases i x pcs , (substElims i x ee) )
                    |> thenPairResult (\pcsS -> \ eeS -> lamP pcsS eeS)
        Lam ai b ->  (substAbs i x ai b) |> Result.map (Lam ai)          
        Var ii ee -> let tail = (substElims i x ee) in
                     if ii == i
                     then tail |> Result.andThen (nfApp (liftTerm i x))
                     else Result.map (Var ii) tail
        Def (FromContext j) ee -> Result.map (Def (FromContext j)) (substElims i x ee)
        Def (BuildIn bi) ee -> (substElims i x ee) |> Result.map (nfBI bi)             
        Pi td tb -> case ((domMapResult (subst i x) td) , (substAbs i x td.domInfo tb)) of
                     (Ok tdd , Ok tbb) -> Ok (Pi tdd tbb )
                     _ -> Err "Some err in subst - Pi"
                                      
        Star -> Ok Star
    ) |> Result.andThen pathAppElim
                
-- it can be used only with terms without free variables (as secound argument)
substIC : Int -> Term -> Term -> Result String Term
substIC i x e =
    (case e of
        LamP pcs ee -> (substPartialCasesIC i x pcs , (substElimsIC i x ee) )
                    |> thenPairResult (\pcsS -> \ eeS -> lamP pcsS eeS)
        Lam ai b ->  (absMapResult (substIC i x) b) |> Result.map (Lam ai)          
        Var j ee -> Result.map (Var j) (substElimsIC i x ee)
        Def (FromContext ii) ee ->
                     let tail = (substElimsIC i x ee) in
                     if ii == i
                     then tail |> Result.andThen (nfApp (x))
                     else
                         let iii = if (ii > i) then ii - 1 else ii 
                         in Result.map (Def (FromContext iii)) tail
        Def (BuildIn bi) ee -> (substElimsIC i x ee) |> Result.map (nfBI bi)             
        Pi td tb -> case ((domMapResult (substIC i x) td) , (absMapResult (substIC i x) tb)) of
                     (Ok tdd , Ok tbb) -> Ok (Pi tdd tbb )
                     _ -> Err "Some err in subst - Pi"
                                      
        Star -> Ok Star)
        |> Result.andThen pathAppElim

-- those two verions are used in Ctx.elm, and there is jsutification for them           
substIC2 : Int -> Term -> Term -> Result String Term
substIC2 i x e =
    (case e of
        LamP pcs ee -> (substPartialCasesIC2 i x pcs , (substElimsIC2 i x ee) )
                    |> thenPairResult (\pcsS -> \ eeS -> lamP pcsS eeS)
        Lam ai b ->  (absMapResult (substIC2 i x) b) |> Result.map (Lam ai)          
        Var j ee -> Result.map (Var j) (substElimsIC2 i x ee)
        Def (FromContext ii) ee ->
                     let tail = (substElimsIC2 i x ee) in
                     if ii == i
                     then tail |> Result.andThen (nfApp (x))
                     else Result.map (Def (FromContext ii)) tail
        Def (BuildIn bi) ee -> (substElimsIC2 i x ee) |> Result.map (nfBI bi)             
        Pi td tb -> case ((domMapResult (substIC2 i x) td) , (absMapResult (substIC2 i x) tb)) of
                     (Ok tdd , Ok tbb) -> Ok (Pi tdd tbb )
                     _ -> Err "Some err in subst - Pi"
                                      
        Star -> Ok Star)
        |> Result.andThen pathAppElim

mkPathApp :  (Term , Term) -> Term -> Term -> Result String Term
mkPathApp (e0 , e1) f a = nfApp f [ IApply e0 e1 a ]  
    
mkApp : Term -> Term -> Result String Term         
mkApp f a = nfApp f [Apply {unArg = a , argInfo = AI.default } ]

mkNeg : Term -> Term              
mkNeg t = nfBI Neg [elim t]
            
mkMin : Term -> Term -> Term         
mkMin l r = nfBI Min [elim l , elim r]          

mkMax : Term -> Term -> Term         
mkMax l r = nfBI Max [elim l , elim r]          
            
mkPi : Term -> (Abs Term) -> Term            
mkPi domTm boAbs = Pi
                    {domInfo = AI.default , domName = Nothing , unDom = domTm} 
                    boAbs

mkLamUnsafe : (Abs Term) -> Term           
mkLamUnsafe boAbs = Lam AI.default boAbs


                    
mkLam : (Term) -> (Abs Term) -> Term            
mkLam =
   toIsOne
   >> Maybe.map (\i -> \at -> mkPartial i at.unAbs )     
   >> Maybe.withDefault mkLamUnsafe   
    

              

mkInterval : Term
mkInterval = buildIn Interval
             
mkIEnd : Bool -> Term 
mkIEnd b = if b then (buildIn I1) else (buildIn I0)

toIEnd : Term -> Maybe Bool
toIEnd tm =
    case tm of
        Def (BuildIn I0) [] -> Just False
        Def (BuildIn I1) [] -> Just True                       
        _ -> Nothing
         
elimsBetaEq : Elims -> Elims -> Bool 
elimsBetaEq es1 es2 =
    case (es1 , es2) of
        ([] , (_ :: _)) -> False
        ((_ :: _) , []) -> False
        ((e1 :: ee1) , (e2 :: ee2)) -> (betaEq (elimArg e1) (elimArg e2)) && (elimsBetaEq ee1 ee2)
        ([] , []) -> True                              

-- toma zmienic wystapenia symbolu z kontekstu na Var 0              
mkAbs : String -> Int -> Term -> Abs Term
mkAbs s i t = {absName = s , unAbs = mkAbsSub i 0 t }

       
mkAbsSub : Int -> Int -> Term -> Term              
mkAbsSub cI i e =
     case e of
        LamP pcs ee -> (LamP (mapPartialCases (mkAbsSub cI i) pcs)  (elimsMap (mkAbsSub cI i) ee) )
                    
        Lam ai b -> Lam ai (absMap (mkAbsSub cI (i+1)) b)
        Var ii ee -> Var ii (elimsMap (mkAbsSub cI i) ee)
        Def (FromContext j) ee -> if j == cI
                                  then Var i (elimsMap (mkAbsSub cI i) ee)
                                  else Def (FromContext j) (elimsMap (mkAbsSub cI i) ee)   
                                      
        Def (BuildIn bi) ee -> Def (BuildIn bi) (elimsMap (mkAbsSub cI i) ee)        
        Pi td tb -> Pi (domMap (mkAbsSub cI i) td) (absMap (mkAbsSub cI (i+1)) tb)
        Star -> Star

definedEq : Defined -> Defined -> Bool
definedEq d1 d2 =
    case (d1 , d2) of
        (FromContext i1 , FromContext i2) -> i1 == i2
        (BuildIn b1 , BuildIn b2) -> buildInToken2String b1 == buildInToken2String b2
        _ -> False                             



-- TODO comparing partial cases             
lamPEq : PartialCases -> PartialCases -> Bool
lamPEq pcs1 pcs2 = True
         
betaEq : Term -> Term -> Bool
betaEq t1 t2 =  True
    -- case (t1 , t2) of
    --     ((LamP pcs1 e1) , (LamP pcs2 e2)) -> (lamPEq pcs1 pcs2) && (elimsBetaEq e1 e2)
    --     ((Lam _ b1) , (Lam _ b2)) -> betaEq b1.unAbs b2.unAbs           
    --     ((Var i1 e1) , (Var i2 e2)) -> (i1 == i2) && (elimsBetaEq e1 e2)
    --     ((Def d1 e1) , (Def d2 e2)) -> (definedEq d1 d2) && (elimsBetaEq e1 e2)
    --     ((Pi td1 tb1) , (Pi td2 tb2)) -> (betaEq td1.unDom td2.unDom) && (betaEq tb1.unAbs tb2.unAbs)
    --     (Star , Star) -> True
    --     _ -> False               

ctxVar : Int -> Term             
ctxVar i = Def (FromContext i) []             

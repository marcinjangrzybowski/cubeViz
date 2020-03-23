module MicroAgda.Internal.Expr exposing
    ( Term )

import Debug exposing (..)

import MicroAgda.Internal.ArgInfo as AI exposing (ArgInfo)

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
   
    
type alias Abs a =  {  absName : Maybe String , unAbs : a }
--           | NoAbs { absName : String , unAbs : a }


absMap : (a -> b) -> Abs a -> Abs b
absMap f x = {unAbs = f (x.unAbs) , absName = x.absName }

absMapResult : (a -> Result e a) -> Abs a -> Result e (Abs a)
absMapResult f x = (f (x.unAbs)) |> Result.map (\y -> absMap (\_ -> y) x)    
             
type alias Type = Term

type alias SubFace = List (Term , Bool)
    
type alias PartialCase = {subFace : SubFace , body : Term}
    
type alias PartialCases = List PartialCase

type BuildInToken = Univ | Level | SucLevel | Interval | I0 | I1   

type Defined = FromContext Int | BuildIn BuildInToken        

    
type Term =
 Pi (Dom Type) (Abs Type)
 | Lam ArgInfo (Abs Term)
 | LamP PartialCases Elims   
 | Var Int Elims
 | Def Defined Elims  
 | Star  
   
type Elim a = Apply (Arg a) | IApply a a a

subTermsElim : Elim a -> List a
subTermsElim e = case e of
                     Apply a -> [ a.unArg ]
                     IApply a1 a2 a3 -> [ a1 , a2 , a3 ]
    
type alias Elims = List (Elim Term)
    

type NameInCtx = Exposed String | Shadowed String String
    
type alias Ctx = List (NameInCtx , Type) 


    
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


mapListResult : (a -> Result e b) -> List a -> Result e (List b)
mapListResult f la =
    case la of
        [] -> Ok []
        x :: xs -> case (f x) of
                       Err e -> Err e
                       Ok y -> case mapListResult f xs of
                                   Err ee -> Err ee
                                   Ok ys -> Ok (y :: ys)         


                                            
                                            

nfBI : BuildInToken -> Elims -> Term 
nfBI bi ee = Def (BuildIn bi) ee


nfApp : Term -> Elims -> Result String Term
nfApp h t =
    case h of
        LamP _ ee -> todo ""
        Lam ai b -> todo ""           
        Var i e -> todo ""
        Def (FromContext j) ee -> Ok (Def (FromContext j) ee)
        Def (BuildIn bi) ee -> Ok (nfBI bi ee)
        Pi _ _ -> Err "Pi in Head"
        Star -> Err "Star in Head"       

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


-- TODO : shadowoanie nazw argumentow 
substAbs : Int -> Term -> ArgInfo -> Abs Term -> Result String (Abs Term)
substAbs i x ai at = absMapResult (subst (i + 1) x) at

nfLamP : List PartialCase ->  Result String PartialCases
nfLamP = todo ""

face : (Term , Bool) -> List (Term , Bool)
face = todo ""
       
subFace : List (Term , Bool) -> Result String SubFace
subFace = todo ""

thenPairResult : (a -> b -> Result e c) -> (Result e a , Result e b)  ->  Result e c
thenPairResult f rab =
    case rab of
        (Err e , _) -> Err e
        (_ , Err e) -> Err e
        (Ok a , Ok b) -> f a b               

mapPairResult : (a -> b -> c) -> (Result e a , Result e b)  ->  Result e c
mapPairResult f = thenPairResult (\x -> \y -> Ok (f x y))


                        
subst : Int -> Term -> Term -> Result String Term
subst i x e =
    case e of
        LamP pcs ee -> (substPartialCases i x pcs)
                    |> Result.map (\y -> LamP y ee)
                    |> pcApp   
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
        
-- mkApp : Term -> Term -> Result String Term         
-- mkApp f a =
--     case f of
--         LamP _ -> todo ""
--         Lam ai b -> todo ""           
--         Var i e -> todo ""
--         Def d e -> todo ""
--         Pi _ _ -> todo ""
--         Star -> todo ""                    

module MicroAgda.TCTests exposing (..)

import MicroAgda.Parser exposing (mainParser)
import MicroAgda.Raw as R
import MicroAgda.Internal.Term as I
import MicroAgda.TypeChecker exposing (..)
import MicroAgda.Internal.Ctx exposing (..)
import MicroAgda.Internal.Translate as T

import ParserHelp exposing (..)

import Result
import List

import Debug exposing (..)         
 

import Parser exposing (run)

type alias TCTCase = { name : String
                     , content : String
                     , against : Maybe String
                     , assume : Bool
                     , normal : Maybe String           
                     }
    
type alias TCTCaseResult =
    Result
      { msg : String }
      { ctype : CType , rawTerm : R.Raw , internalTerm : I.Term , internalNormalTerm : Maybe I.Term} 


          
            
tCTCases : List TCTCase    
tCTCases = [
    { name = "test1" , content = "Type ℓ-zero" ,
         against = Nothing , assume = True , normal = Nothing},
   
   { name = "test1" , content = "∀ ( a : Type ℓ-zero ) → Type ℓ-zero" ,
         against = Nothing , assume = True , normal = Nothing},
      { name = "test1" , content = "∀ ( a : Type ℓ-zero ) → a" ,
         against = Nothing , assume = True , normal = Nothing},
        { name = "test1" , content = "∀ ( a : Type ℓ-zero ) → ((λ b → b) a) " ,
         against = Nothing , assume = True , normal = Nothing},
   { name = "test1" , content = "∀ ( a : Type ℓ-zero ) → ∀ ( aa : Type ℓ-zero ) → ∀ ( b : ∀ ( a : Type ℓ-zero ) → (Type ℓ-zero) ) → ∀ ( x : b a ) → b aa" ,
         against = Nothing , assume = True , normal = Nothing},
           { name = "test1" , content = "λ a → λ aa → λ b → λ x → λ xx → xx x" ,
         against = Just "∀ ( aq : Type ℓ-zero ) → ∀ ( aaq : Type ℓ-zero ) → ∀ ( bq : ∀ ( aq : Type ℓ-zero ) → (Type ℓ-zero) ) → ∀ ( xq : bq aq ) → ∀ ( xxq : ∀ ( xyq : bq aq ) → bq aaq ) → bq aaq" , assume = True , normal = Nothing}
        ,
   { name = "test1"
   , content = "(i0 ∨ i0) ∧ i0 ∨ ~ i1 ∧ i0 ∨ i0"
   , against = Just "I"
   , assume = True , normal = Just "i0"}
   , { name = "test1"
   , content = "λ i → λ j → λ k → λ l → λ m → λ n → ((k ∨ j) ∨ i  ) ∧ ~ (k ∨ ~ k ∨ k ∨ ((~ m ∨ ~ (~ j) ∧ n ) ∨ k  )) ∧ ~ n"
   , against = Just "∀ ( i : I ) → ∀ ( j : I ) →∀ ( k : I ) → ∀ ( l : I )  → ∀ ( m : I ) → ∀ ( n : I ) → I"
   , assume = True , normal = Nothing}
   , { name = "test1"
   , content = """
λ l → λ st → λ A → λ a → λ i → λ j → λ k → j a
"""
   , against = Just "∀ ( l : Level ) → ∀ ( st : ∀ ( q : Type l ) → Type l ) → ∀ ( A : Type l ) → ∀ ( a : A ) → ∀ ( i : I ) → ∀ ( j : ∀ ( q : A ) → st A )  → ∀ ( k : I ) → st A "
   , assume = True , normal = Nothing}
   , { name = "test1"
   , content = """
λ l → λ A → λ a → λ i → λ j → λ k → λ p → ( λ {
                      (i = i0) → p j
                    ; (j = i1) → a
                    ; (k = i1)  → a
                    })
"""
   , against = Just "∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ ( a : A ) → ∀ ( i : I ) → ∀ ( j : I )  → ∀ ( k : I ) → ∀ ( p : ∀ ( q : I ) → A ) →  Partial l ((~ i) ∨ k ∨ j) A"
   , assume = True , normal = Nothing}
  , { name = "test1"
   , content = """
λ l → λ A → λ a → λ i → λ j → λ k → ( λ {
                      (i = i0) (j ∧ k = i1) → a
                    ; (j = i0) (i0 = i0) → a
                    ; (j = i0) (i = i1) → a
                    ; (k ∨ i = i0) → a
                    ; (i1 = i1)((~ (k ∨ i)) ∧ j = i1) → a
                    })
"""
   , against = Just "∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ ( a : A ) → ∀ ( i : I ) → ∀ ( j : I )  → ∀ ( k : I ) → Partial l ((~ i ∧ j ∧ k) ∨ ~ j ∨ (i ∧ ~ j) ∨ (~ i ∧ ~ k) ∨ ~ i ∧ j ∧ ~ k) A"
   , assume = True , normal = Nothing}
   , { name = "test1"
   , content = """
λ l → λ A → λ a → λ i → λ j → λ k → ( λ {
                      (i = i0) (j ∧ k = i1) → a
                    ; (j = i0) (i0 = i0) → a
                    ; (j = i0) (i = i1) → a
                    ; (k ∨ i = i0) → a
                    ; (i1 = i1)((~ (k ∨ i)) ∧ j = i1) → a
                    })
"""
   , against = Just "∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ ( a : A ) → ∀ ( i : I ) → ∀ ( j : I )  → ∀ ( k : I ) → Partial l (j) A"
   , assume = False , normal = Nothing}
      , { name = "test1"
   , content = """
λ l → λ A → λ a → λ b → λ c →  λ x → λ f → λ a → f a  
"""
   , against = Just "∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ ( a b c x : A ) → (A → A) → A → A"
   , assume = True , normal = Nothing}
  ]


    
    
preRunTestAgainst : String -> (Result String CType)
preRunTestAgainst againstCode =
    let parsingResult = Parser.run mainParser againstCode
    in
    case parsingResult of
        Ok r ->
          let typingResult = tCstart ctUniv r in    
          case typingResult of
              Ok t ->
                  (Ok (CT t)) 
              Err er ->
                  (Err er)
        Err e -> (Err (ParserHelp.deadEndsToString2 e))    
    
preRunTest : TCTCase -> CType -> Result (String , TCTCase) (TCTCase , TCTCaseResult)
preRunTest x against =
    let parsingResult = Parser.run mainParser x.content in
    let parsingResultNormal = Maybe.map (Parser.run mainParser) x.normal                    
    in
    case (parsingResult , parsingResultNormal) of

        (Err _ , _) -> Err ("Bad test case , parse error in content" , x)
        (_ , (Just (Err _))) -> Err ("Bad test case , parse error in desired normal form" , x)             
        (Ok r , Nothing) ->  
          let typingResult = tCstart against r in
          case typingResult of
              Ok t ->                  
                  Ok (x , Ok {
                              ctype = against
                            , rawTerm = r
                            , internalTerm = t
                            , internalNormalTerm = Nothing      
                          }  ) 
              Err er ->
                  Ok (x , Err { msg = er})
        (Ok r , Just (Ok nr)) ->  
          let typingResult = tCstart against r in
          let typingResultNormal = tCstart against nr in
          case (typingResult , typingResultNormal) of
              (Ok t , Ok tm) ->
                  if (I.betaEq t tm)
                  then Ok (x , Ok {
                              ctype = against
                            , rawTerm = r
                            , internalTerm = t
                            , internalNormalTerm = Just tm      
                           }  )
                  else Ok (x , Err {msg = "normalization failed!\nexpected:\n\n"
                                        ++ T.t2strNoCtx tm
                                        ++ "\n\ngot:\n\n"
                                        ++ T.t2strNoCtx t
                                   })    
              (Err er , _) ->
                  Ok (x , Err { msg = er})
              (_ , Err er) ->
                  Err ("Bad test case , typing error in desired normal form" , x)        
                      
                                
runTest : TCTCase -> Result (String , TCTCase) (TCTCase , TCTCaseResult)
runTest x = (x.against |> (Maybe.map ( preRunTestAgainst )) )             
           |> (Maybe.withDefault (Ok ctUniv) ) 
           |> Result.mapError (\e -> ("bad test case , against def error : " ++ x.name ++ "  " ++ e , x))   
           |> Result.andThen ( (preRunTest x))
              

runTests = List.map runTest tCTCases           

              

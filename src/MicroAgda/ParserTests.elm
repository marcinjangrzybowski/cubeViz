module MicroAgda.ParserTests exposing (..)

import MicroAgda.Parser exposing (mainParser)
import MicroAgda.Raw exposing  (..)

import ParserHelp exposing (..)

import Result
import List

import Parser exposing (run)

type alias ParseTCase = { name : String , content : String , asume : Bool }
    
type alias ParseTCaseResult =
    Result
      { msg : String , msgRaw : List Parser.DeadEnd }
      { parsed : Raw }
    
            
parseTCases : List ParseTCase    
parseTCases = [
 { content = "a b c d e f" , name = "" , asume = True } ,
 { content = "a ( b c d ) e f" , name = "" , asume = True } ,
 { content = "a ((b c) d) e f" , name = "" , asume = True } ,
 { content = """
∀  ( ℓ : Level ) → ∀(A : Type ℓ ) → ∀ ( φ : I ) 
  → ∀ ( u : ∀ ( i : I )
  → Partial ℓ φ A ) → Sub ℓ A φ ( u i0 ) → ∀ ( i : I ) → A """ , name = "" , asume = True } ,
 { content = "λ ℓ → λ A → ∀ ( φ : I ) → ∀ ( u : ∀ ( i : I ) → Partial ℓ φ A ) → ∀ ( u0 : Sub ℓ A φ ( u i0 ) ) → ∀ ( i : I ) → A" , name = "" , asume = True } ,
 { content =
       """
    λ {
       (j = i1) (k = i1) (~ i = i1)  → a
     ; (~ k = i1) (i = i0)  → a
     ; (~ k = i1) (i = i0) (j = i1)  → a
     ; (k = i0) (i = i0) (j = i1)→ a
     ; (~ j ∧ ~ j = i1) (i1 = i1) → a

      }
  """ , name = "" , asume = True } ,
  { content = "(w j) ∧ (w j)" , name = "" , asume = True },
    { content = "w j ∧ w j" , name = "" , asume = True },
     { content = "∀ ( a : Type ℓ-zero ) → ∀ ( b : Type ℓ-zero ) → a" , name = "" , asume = True },
     { content = "(i ∨ j) ∧ i ∨ g ∧ z ∨ q" , name = "" , asume = True }, 
 { content = "( ((f (i ∨ (j ∧ i))) ∨ ((g j) ∧ (f i)) ∨ i0))" , name = "" , asume = True } 
 , { content = """
λ l → λ A → λ a → λ i → λ j → hcomp (λ k → ( λ {
                      (i = i0) (j ∧ k = i1) → a
                    ; (j = i0) (i0 = i0) → a
                    ; (j = i0) (i = i1) → a
                    ; (k ∨ i = i0) → a
                    ; (i1 = i1)((~ (k ∨ i)) ∧ j = i1) → a
                    }))
"""
   , name = "" , asume = True }
 , { content = """
hcomp ( λ j → λ { (φ = i1) → u (i ∧ j) 1=1 ; (i = i0) → outS u0 } ) (outS u0)
"""
   , name = "" , asume = True } ,
   { content = "∀ ( x y z : A ) → I → I → A"
   , name = "" , asume = True } ,
   { content = "∀ ( x y z : A ) → x ≡ y → y ≡ z → I → I → A"
   , name = "" , asume = True }
     ]

runTest : ParseTCase -> (ParseTCase , ParseTCaseResult)
runTest x =
    let parsingResult = Parser.run mainParser x.content in
          case parsingResult of
              Ok parsed ->
                  (x , Ok { parsed = parsed }) 
              Err ers ->
                  (x , Err { msgRaw = ers , msg = (ParserHelp.deadEndsToString2 ers)})
          
--runTests : List (ParseTCaseResult)
runTests = List.map runTest parseTCases           

              

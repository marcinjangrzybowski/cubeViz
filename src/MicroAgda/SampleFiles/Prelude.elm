module MicroAgda.SampleFiles.Prelude exposing (content)

import MicroAgda.File exposing (upc,mkFile)

content = mkFile "prelude" [        
    upc "hfill" """
∀ ( l : Level ) → ∀ ( A : Type l) 
        → ∀ (φ : I)
        → ∀ (u : ∀ ( i : I) → Partial l φ A)
        → ∀ (u0 : Sub l A φ (u i0))
        → ∀ (i : I) → A
"""
        ["ll" ,"B" , "φ" , "u" , "u0" , "i"]
           """
hcomp ll B (φ ∨ ~ i) ( λ k → λ { (φ = i1) → u (i ∧ k) 1=1 ; (i = i0) → outS ll B φ (u i0) u0 } ) 
                                   (outS ll B φ (u i0) u0)
"""
        [] ,

      upc "Path" """
∀ ( l : Level ) → ∀ ( A : Type l ) → A → A → Type l
"""
        ["l" ,"A" , "x" , "y"]
           """PathP l (λ q → A) x y
"""
        []
   
   ,
         upc "compPath-filler" """
∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A
"""
        ["l" ,"A" , "x" , "y" , "z" , "p" , "q"]
           """
λ j → λ i → hfill l A (~ i ∨ i) (λ k → λ { (i = i0) → x
                   ; (i = i1) → q k }) (inS l A (~ i ∨ i) (p i)) j
"""
        []    
   ,
         upc "compPath" """
∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z
"""
        ["l" ,"A" , "x" , "y" , "z" , "p" , "q", "j"]
           """
compPath-filler l A x y z p q i1 j
"""
        []    
   ,
         upc "compPath'-filler" """
∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A
"""
        ["l" ,"A" , "x" , "y" , "z" , "p" , "q", "j" , "i"]
           """
hfill l A (~ i ∨ i) (λ k → λ { (i = i0) → p (~ k)
                   ; (i = i1) → z }) (inS l A (~ i ∨ i) (q i)) j
"""
        []
      ,
         upc "compPath'" """
∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → Path l A x z
"""
        ["l" ,"A" , "x" , "y" , "z" , "p" , "q", "j"]
           """
compPath'-filler l A x y z p q i1 j
"""
        []

  ,  upc "comp=comp'" """
∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → 
∀ (p : Path l A x y) →  ∀ (q : Path l A y z) → Path l (Path l A x z) (compPath' l A x y z  p q) (compPath l A x y z p q) """
   ["l" ,"A" , "x" , "y" , "z" , "p" , "q" ,"i" ,"j"] 
   """hcomp l A (~ i ∨ i ∨ ~ j ∨ j) (λ k → λ { (i = i0) → compPath'-filler l A x y z p q k j
                                             ; (i = i1) → compPath-filler l A x y z p q k j
                                             ; (j = i0) → p ( ~ i ∧ ~ k)
                                             ; (j = i1) → q (k ∨ ~ i) }) (helper i j)"""
    [
    upc "helper" "I → I → A"
    ["ii" , "jj"] """hcomp l A (~ ii ∨ ii ∨ ~ jj ∨ jj) (λ kk → λ { (ii = i0) → q (kk ∧ jj)
                                ; (ii = i1) → p (~ kk ∨ jj)
                                ; (jj = i0) → p (~ ii ∨ ~ kk)
                                ; (jj = i1) → q (~ ii ∧ kk) })
                       y""" []
                           ]
                           
--        ,  upc "simpletest" """
-- ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y : A) → 
-- ∀ (p : Path l A x y) → I → I → A """
--    ["l" ,"A" , "x" , "y" ,  "p" ,"i" ,"j"] 
--    "p ((~ i) ∨  ~ j)"
--     [ ]
                                    
--        , upc "simpletest0" """
-- ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (p : I → I → A) → I → I → A """
--    ["l" ,"A" , "p" , "i" ,"j"] 
--    "p i j"
--     [ ]   
     ]


--    compPath-filler : 
-- compPath-filler {x = x} p q j i =
--   hfill (λ j → λ { (i = i0) → x
--                   ; (i = i1) → q j }) (inS (p i)) j
    

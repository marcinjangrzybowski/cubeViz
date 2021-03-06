module MicroAgda.SampleFiles.Sample exposing (content)

import MicroAgda.File exposing (upc,mkFile)


content = mkFile "sample" [        
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

   ,
         upc "compPath-filler'" """
∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z : A) → Path l A x y → Path l A y z → I → I → A
"""
        ["l" ,"A" , "x" , "y" , "z" , "p" , "q", "j" , "i"]
           """
hcomp l A (~ i ∨ i ∨ j) 
    (λ k → λ {
        (i = i0) → p j
      ; (i = i1) → q k
      ; (j = i1) → q (i ∧ k)
      })
    (p (i ∨ j))
"""
        []
   
   ,
    upc "assoc'"

    """
    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w : A) → 
    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w)
      → Path l (Path l A x w)
      (compPath l A x y w p (compPath l A y z w q r)  )
      (compPath l A x z w (compPath l A x y z p q) r)
    """
       ["l" ,"A" , "x" , "y" , "z" , "w" , "p" , "q" , "r" ,"m"] 
    """
    compPath l A 
      (compPath-filler l A x y z p q m i0)
      (compPath-filler l A x y z p q m i1)
      (compPath-filler' l A y z w q r m i1)
      (λ i → compPath-filler l A x y z p q m i)
      (λ i → compPath-filler' l A y z w q r m i) 
    """
       []

   ,
    upc "test3d"

    """
    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y : A) → 
    ∀ (p : Path l A x y) → I → I → I → A
    """
       ["l" ,"A" , "x" , "y" , "p" , "i" , "j" ,"k"] 
    """
p (i ∨ j ∨ k)
    """
       []
       
 ]
       

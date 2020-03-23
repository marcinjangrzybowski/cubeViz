module MicroAgda.SampleFiles.Assoc exposing (content)

import MicroAgda.File exposing (upc,mkFile)

content = mkFile "assoc" [        
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
λ j → λ i → hfill l A (~ i ∨ i) (λ j → λ { (i = i0) → x
                   ; (i = i1) → q j }) (inS l A (~ i ∨ i) (p i)) j
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
hfill l A (~ i ∨ i) (λ j → λ { (i = i0) → p (~ j)
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
    upc "3outof4-filler"

    """
∀ (l : Level) → ∀ (A : Type l) → ∀ (α : I → I → A) → ∀ (p : Path l A (α i1 i0) (α i1 i1))
  → ∀ (β : PathP l (λ j → Path l A (α j i0) (α j i1)) (λ i → α i0 i) p) → I → I → I → A
    """
       ["l" ,"A" , "α" , "p" , "β" , "k" , "j" ,"i"] 
    """
hfill l A (~ i ∨ i ∨ ~ j ∨ j)
         (λ ii → λ { (i = i0) → α ii i0
                  ; (i = i1) → α ii i1
                  ; (j = i0) → α ii i
                  ; (j = i1) → β ii i
                  }) (inS l A (~ i ∨ i ∨ ~ j ∨ j) (α i0 i)) k
    """
       []
   ,
    upc "3outof4"

    """
∀ (l : Level) → ∀ (A : Type l) → ∀ (α : I → I → A) → ∀ (p : Path l A (α i1 i0) (α i1 i1))
  → ∀ (β : PathP l (λ j → Path l A (α j i0) (α j i1)) (λ i → α i0 i) p)
 → Path l (Path l A (α i1 i0) (α i1 i1)) (λ i → α i1 i) p
    """
       ["l" ,"A" , "α" , "p" , "β" , "j" ,"i"] 
    """
3outof4-filler l A α p β i1 j i
    """
       []
    ,
    upc "preassoc-filler"

    """
∀ (l : Level) → ∀ (A : Type l) → ∀ (x y z w : A)
→ ∀ (p : Path l A x y) → ∀ (q : Path l A y z)
→ ∀ (r : Path l A z w) → I → I → I → A
    """
       ["l", "A", "x", "y", "z", "w" ,"p", "q", "r", "k" ,"j" ,"i"] 
    """
  hfill l A (~ i ∨ i ∨ ~ j) (λ kk → λ { (i = i0) → x
                  ; (i = i1) → compPath-filler l A y z w q r kk j
                  ; (j = i0) → p i
                  }) (inS l A (~ i ∨ i ∨ ~ j) (compPath-filler l A x y z p q j i)) k
    """
       []   
    ,
    upc "preassoc"

    """
∀ (l : Level) → ∀ (A : Type l) → ∀ (x y z w : A)
                   → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)
                   → ∀ (r : Path l A z w)
                   → PathP l  (λ j → Path l A x ((compPath l A y z w q  r) j)) p
                     (compPath l A x z w (compPath l A x y z p  q) r)  
    """
       ["l", "A", "x", "y", "z", "w" ,"p", "q", "r","j" ,"i"] 
    """
 preassoc-filler l A x y z w p q r i1 j i
    """
       []
  ,
   upc "assoc"
       """
    ∀ (l : Level) → ∀ (A : Type l)
            → ∀ (x y z w : A)
            → ∀ (p : Path l A x y) → ∀ (q : Path l A y z)
                       → ∀ (r : Path l A z w) →
      Path l (Path l A x w)                  
     (compPath l A x y w p (compPath l A y z w q r))
     (compPath l A x z w (compPath l A x y z p  q) r)
        """
        ["l", "A", "x", "y", "z", "w" ,"p", "q", "r"] 
    """
    3outof4 l A
      (compPath-filler l A x y w p (compPath l A y z w q r))
      (compPath l A x z w (compPath l A x y z p q) r)
      (preassoc l A x y z w  p q r)   
    """
   []
       
  ]

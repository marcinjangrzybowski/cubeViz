module MicroAgda.SampleFiles.Evan exposing (content)

import MicroAgda.File exposing (upc,mkFile)


content = mkFile "evan" [        
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
       [] ,
   upc "compSq"  """∀ (l : Level) → ∀ (A : Type l)
        → ∀ (x y : A) 
        → ∀ (p q r : Path l A x y)
        → ∀ (pq : Path l (Path l A x y) p q)
        → ∀ (qr : Path l (Path l A x y) q r)
        → Path l (Path l A x y) p r
    """
     ["l" , "A" , "x" , "y" , "p" , "q" , "r" , "pq" , "qr" , "i" , "j"]
       """
       hcomp l A (i ∨ ~ i ∨ j ∨ ~ j) (λ k → λ {
          (i = i0) → p j
        ; (i = i1) → (qr k j)
        ; (j = i0) → x
        ; (j = i1) → (y)
         }) (pq i j)
       """ []
   ,
     upc
     "congPa" """∀ (l : Level) → ∀ (A : Type l)
             → ∀ (x y z : A)
             → ∀ (yz : Path l A y z)
             → ∀ (p q : Path l A x y)
             → ∀ (pq : Path l (Path l A x y) p q)
             → Path l (Path l A x z)
             (compPath l A x y z p yz)
             (compPath l A x y z q yz)"""
     ["l" , "A" ,"x" ,"y" ,"z" ,"yz" ,"p" ,"q" ,"pq" ,"i"]
          "compPath l A x y z (pq i) yz" []
     ,
     upc
     "congPa2" """∀ (l : Level) → ∀ (A : Type l)
        → ∀ (x y z : A)
        → ∀ (xy : Path l A x y)
        → ∀ (p q : Path l A y z)
        → ∀ (pq : Path l (Path l A y z) p q)
        → Path l (Path l A x z)
        (compPath l A x y z xy p)
        (compPath l A x y z xy q)"""
     ["l" , "A" ,"x" ,"y" ,"z" ,"yz" ,"p" ,"q" ,"pq" ,"i"]
          "compPath l A x y z yz (pq i)" []      

   ,       
    upc "pentA"

    """
    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w v : A) → 
    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w) →  ∀ (s : Path l A w v)
      → I → I → A
    """
       ["l" ,"A" , "x" , "y" , "z" , "w" , "v" , "p" , "q" , "r" ,"s"] 
    """
  compSq l A x v
  (compPath l A x y v p
    (compPath l A y z v q (compPath l A z w v r s)))
  (compPath l A x z v (compPath l A x y z p q)
    (compPath l A z w v r s))
  (compPath l A x w v (compPath l A x z w (compPath l A x y z p q) r)
    s)
  (assoc' l A x y z v p q (compPath l A z w v r s))
  (assoc' l A x z w v (compPath l A x y z p q) r s)
    """
       []

           ,

       upc "pentB"

    """
    ∀ ( l : Level ) → ∀ ( A : Type l ) → ∀ (x y z w v : A) → 
    ∀ (p : Path l A x y) →  ∀ (q : Path l A y z) →  ∀ (r : Path l A z w) →  ∀ (s : Path l A w v)
      → I → I → A
    """
       ["l" ,"A" , "x" , "y" , "z" , "w" , "v" , "p" , "q" , "r" ,"s"]

            """
        compSq l A x v (compPath l A x y v p
                         (compPath l A y z v q (compPath l A z w v r s))) (compPath l A x w v (compPath l A x y w p (compPath l A y z w q r))
                                                                            s) (compPath l A x w v (compPath l A x z w (compPath l A x y z p q) r)
                                                                                 s)
        (compSq l A x v (compPath l A x y v p
                                (compPath l A y z v q (compPath l A z w v r s))) (compPath l A x y v p
                                     (compPath l A y w v (compPath l A y z w q r) s)) (compPath l A x w v (compPath l A x y w p (compPath l A y z w q r))
                                          s)
        (congPa2 l A x y v p (compPath l A y z v q (compPath l A z w v r s))
        (compPath l A y w v (compPath l A y z w q r) s)
          (assoc' l A y z w v q r s))
        (assoc' l A x y w v p (compPath l A y z w q r) s))
        (congPa l A x w v s (compPath l A x y w p (compPath l A y z w q r))
        (compPath l A x z w (compPath l A x y z p q) r)
        (assoc' l A x y z w p q r))""" []

    ]

                                      
       

module MicroAgda.SampleFiles.TestTypeErr exposing (content)

import MicroAgda.File exposing (upc,mkFile)

content = mkFile "testTypeErr" [
    upc "f1" "∀ (i : I) → ∀ (j : I) → ∀ (k : I) → I"
        ["i", "j" , "k"]
           "( k ∨ j ) ∨ (f11 i j)"
        [
           upc "f11" "∀ (ii : I) → ∀ (jj : I I) → I"
               ["iii", "jjj"]
           "k ∨ jjj"
        [
   upc "f111" "∀ (ii : I I) → ∀ (jj : I) → I"
               ["iii", "jjj"]
           "k ∨ jjj"
        [] , upc "f112" "∀ (ii : I) → ∀ (jj : I) → I"
               ["iii", "jjj"]
           "k ∨ jjj"
        []


        

        ]
         
        ],       
    upc "intervalOps1" "∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I"
        ["i", "j" , "k"]
           "λ l → λ m → λ n → ( ( k ∨ j ) ∨ i ) ∧ ( ~ ( k ∨ ( ~ k ) ∨ k ∨ ( ( ~ m ) ∨ ( ~ ( ~ j ) ) ∧ n ) ∨ k ) ) ∧ ~ n"
        [],
    upc "intervalOps2" "∀ (i : I) → ∀ (j : I) → ∀ (k : I) → ∀ (l : I) → ∀ (m : I) → ∀ (n : I) → I"
        ["i", "j" , "k"]
                      "λ l → λ m → λ n → f1 l m n "
           -- "λ l → λ m → λ n → ( ( k ∨ j ) ∨ i ) ∧ ( ~ ( k ∨ ( ~ k ) ∨ k ∨ ( ( ~ m ) ∨ ( ~ ( ~ j ) ) ∧ n ) ∨ k ) ) ∧ ~ (f1 l m n)"
        []    
     ]

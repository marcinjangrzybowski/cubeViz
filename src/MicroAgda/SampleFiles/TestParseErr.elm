module MicroAgda.SampleFiles.TestParseErr exposing (content)

import MicroAgda.File exposing (upc,mkFile)

content = mkFile "testParseErr" [
    upc "f1" "∀ (i : I) → ∀ (j : I) → qq∀ (k : I) → I"
        ["i", "j" , "k"]
           "( k ∨ j ) ∨ (f11)"
        [
           upc "f11" "∀ (ii : I) → ∀ (jj : I) → I"
               ["iii", "jjj"]
           "k ∨ jjj"
        [
   upc "f111" "∀z (i-i : I) → ∀ (jj : I) → I"
               ["iii", "jjj"]
           "k ∨ jjj"
       [] , upc "f112" "∀qq (ii : I) → ∀ (jj : I) → I"
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

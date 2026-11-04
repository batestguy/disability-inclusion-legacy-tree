import summary from "../../../content/methodology-summary.json";

// Plain-language account of the implemented workflow; saved settings remain below.
export const methodology = summary;

export const modelSettings = [
  ["Features", "TF-IDF; unigrams + bigrams; min_df=3; max_df=0.85; sublinear_tf=True"],
  ["Model", "NMF; 8 components; nndsvda; coordinate descent; random_state=42"],
  ["Convergence", "max_iter=600; tol=0.0001; selected fit: 839 features, 117 iterations"],
];

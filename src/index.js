import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <Test /> */}
  </React.StrictMode>
);

// function Test() {
//   const [rating, setRating] = useState(0);
//   return (
//     <StarRating
//       maxRatings={10}
//       color="red"
//       size={20}
//       messages={["Very Bad", "Bad", "Moderate", "Good", "Excellent"]}
//       onRatingSelection={setRating}
//     />
//   );
// }

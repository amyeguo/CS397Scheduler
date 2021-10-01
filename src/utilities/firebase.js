import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useState, useEffect } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyBiXL6Or0yBQVIteaI4C1cw5gFTs-mwRVI",
  authDomain: "cs397-scheduler-69e10.firebaseapp.com",
  databaseURL: "https://cs397-scheduler-69e10-default-rtdb.firebaseio.com",
  projectId: "cs397-scheduler-69e10",
  storageBucket: "cs397-scheduler-69e10.appspot.com",
  messagingSenderId: "322763788775",
  appId: "1:322763788775:web:ece0eafe37aed4f1cc6d42",
  measurementId: "G-PZ24LCCT8E",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const dbRef = ref(database, path);
    const devMode =
      !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    if (devMode) {
      console.log(`loading ${path}`);
    }
    return onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        if (devMode) {
          console.log(val);
        }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      },
      (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      }
    );
  }, [path, transform]);

  return [data, loading, error];
};

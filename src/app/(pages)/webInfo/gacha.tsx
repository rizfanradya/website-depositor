/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import Swal from "sweetalert2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function Gacha({ session }: { session: number }) {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [buttonPlay, setButtonPlay] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [cashout, setCashout] = useState(0);
  const [speed, setSpeed] = useState(0);
  const intervalRef = useRef<any>(null);
  const timeoutRef = useRef<any>(null);
  const [currentEarnings, setCurrentEarnings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/getDeposit`);
        setDeposit(data.result);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, [session]);

  const data = {
    labels:
      dataPoints.length > 0
        ? Array.from({ length: dataPoints.length }, (_, i) => i + 1)
        : [],
    datasets: [
      {
        fill: true,
        label: "",
        data: dataPoints.map((value, index) => ({ x: index + 1, y: value })),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    if (buttonPlay) {
      startUpdatingChart();
    } else {
      clearInterval(intervalRef.current);
    }
  }, [buttonPlay]);
  useEffect(() => {
    if (cashout > 0) {
      clearInterval(intervalRef.current);
    }
  }, [cashout]);

  async function startGacha() {
    if (speed === 0) {
      Swal.fire({
        icon: "error",
        title: "Nominal tidak boleh kosong",
        allowOutsideClick: false,
      });
    } else {
      if (deposit < speed) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Saldo deposit tidak cukup. Saldo saat ini Rp ${deposit.toLocaleString(
            "id-ID"
          )},-`,
          allowOutsideClick: false,
        });
      } else {
        setCashout(0);
        const randomSeconds = Math.floor(Math.random() * 100) + 1;
        const currentTime = Date.now();
        setStartTime(currentTime);
        setDataPoints([]);
        setButtonPlay(true);
        timeoutRef.current = setTimeout(async () => {
          const elapsedTime = Math.floor((Date.now() - currentTime) / 1000);
          setCashout(0);
          setButtonPlay(false);
          try {
            const addResult = await axios.post(`/api/addBetting`, {
              session,
              time: elapsedTime,
              nominal: 0,
            });
            Swal.fire({
              icon: "warning",
              title: "Coba lagi",
              text: `Rp 0,-`,
              confirmButtonText: "OK",
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              }
            });
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Server Error 404",
              allowOutsideClick: false,
            });
          }
        }, randomSeconds * 1000);
      }
    }
  }

  async function handleCashout() {
    if (!buttonPlay) return;
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    setCashout(speed * elapsedTime);
    setButtonPlay(false);
    if (deposit < speed * elapsedTime) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Saldo deposit tidak cukup. Saldo saat ini Rp ${deposit.toLocaleString(
          "id-ID"
        )},-`,
        allowOutsideClick: false,
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } else {
      try {
        const addResult = await axios.post(`/api/addBetting`, {
          session,
          time: elapsedTime,
          nominal: speed * elapsedTime,
        });
        Swal.fire({
          icon: "success",
          title: "Selamat",
          text: `Anda mendapatkan Rp ${speed * elapsedTime},-`,
          allowOutsideClick: false,
          confirmButtonText: "OK",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Server Error 404",
          allowOutsideClick: false,
        });
      }
    }
  }

  const startUpdatingChart = () => {
    intervalRef.current = setInterval(() => {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const earnings = elapsedTime * speed;
      setDataPoints((prevDataPoints) => [...prevDataPoints, earnings]);
      setCurrentEarnings(earnings);
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center text-xl text-white justify-center">
        <span className="bg-black py-2 px-6 font-semibold rounded-xl flex items-center justify-center gap-2">
          <span className="rounded-full bg-red-500 p-1 text-sm">Rp</span>
          {deposit.toLocaleString("id-ID")},-
        </span>
      </div>
      <Line data={data} options={options} className="my-4 max-h-96" />
      <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-center gap-4 max-w-3xl m-auto text-center">
        <div className="flex flex-col items-center justify-center">
          <span>Cashout</span>
          {buttonPlay ? (
            <div
              onClick={handleCashout}
              className={`btn hover:bg-slate-800 bg-slate-700 transition text-white w-full`}
            >
              Rp {currentEarnings},-
            </div>
          ) : (
            <div
              className={`btn !bg-slate-400 btn-disabled !text-white w-full`}
            >
              Rp {cashout},-
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <span>Speed</span>
          {buttonPlay ? (
            <div className="input input-disabled w-full flex items-center justify-center">
              {speed}
            </div>
          ) : (
            <input
              type="number"
              required
              defaultValue={speed}
              className={`input w-full input-bordered`}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
            />
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          <span>Waiting for the next round</span>
          {buttonPlay ? (
            <div
              className={`btn btn-disabled !bg-slate-400 !text-white w-full`}
            >
              WAITING
            </div>
          ) : (
            <div
              onClick={startGacha}
              className={`btn bg-slate-700 hover:bg-slate-800 transition text-white w-full`}
            >
              PLAY
            </div>
          )}
        </div>
      </div>
    </>
  );
}

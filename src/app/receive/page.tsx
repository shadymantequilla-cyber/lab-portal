"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "../../utils/supabase";
import { useSearchParams } from "next/navigation";

function ReceiveContent() {
  const [sample, setSample] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

useEffect(() => {
  if (id) {
    fetchSample(id);
  }
}, [id]);

  // This part will eventually "read" the ID from the QR code scan
  const fetchSample = async (id: string) => {
    const { data, error } = await supabase
      .from("samples")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setSample(data);
      setStatus(data.status);
    }
  };

  const handleReceive = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("samples")
      .update({ status: "Received" })
      .eq("id", sample.id);

    if (!error) {
      setStatus("Received");
      alert("Sample marked as Received!");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F5F5F0] p-8 text-[#2D3748]">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md border border-stone-200">
        <h1 className="text-2xl font-bold text-[#2D3748] mb-6">Lab Receipt Portal</h1>
        
        {!sample ? (
          <p className="text-slate-500 italic">Waiting for scan...</p>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#f0f5f2] rounded border border-[#c8ddd1]">
              <p className="text-sm font-bold text-[#4A7C59]">Sample Identified:</p>
              <p className="text-xl font-semibold">{sample.sample_name}</p>
              <p className="text-sm text-slate-500">Lot: {sample.lot_number}</p>
            </div>

            <div className="flex items-center justify-between">
              <span>Current Status:</span>
              <span className={`px-3 py-1 rounded-full font-bold text-sm ${status === 'Received' ? 'bg-[#4A7C59] text-white' : 'bg-yellow-100 text-yellow-700'}`}>
                {status}
              </span>
            </div>

            {status !== "Received" && (
              <button 
                onClick={handleReceive}
                disabled={loading}
                className="w-full bg-[#4A7C59] text-white py-3 rounded-md font-bold hover:bg-[#3a6347] transition-colors"
              >
                {loading ? "Updating..." : "Confirm Receipt"}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function ReceivePage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 p-8 flex items-center justify-center"><p className="text-slate-500">Loading...</p></main>}>
      <ReceiveContent />
    </Suspense>
  );
}
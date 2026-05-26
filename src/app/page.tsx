"use client";
import { useState } from "react";
import { supabase } from "../utils/supabase";
import QRCode from "react-qr-code";

export default function LabPortal() {
  const [sampleName, setSampleName] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [matrix, setMatrix] = useState("Powder");
  const [savedId, setSavedId] = useState("");
  const [selectedTests, setSelectedTests] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure you ran: ALTER TABLE samples ADD COLUMN tests text[]; in Supabase SQL Editor
    const { data, error }: { data: any; error: any } = await supabase
      .from("samples")
      .insert([{ 
        sample_name: sampleName, 
        lot_number: lotNumber, 
        matrix: matrix,
        status: "Pending",
        tests: selectedTests // This connects to your LIMS test master data
      }])
      .select();

    if (!error && data) {
      setSavedId(data[0].id);
      alert("Sample Saved Successfully!");
    } else {
      console.error(error);
      alert("Error saving sample: " + (error as any)?.message);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 md:p-8 text-slate-900">
      {/* This Style tag hides the form when you click "Print" */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print-section, .print-section * { visibility: visible; }
          .print-section { 
            position: absolute; 
            left: 0; top: 0; 
            width: 4in; height: 2in; /* Standard Sticker Size */
            border: none !important;
            box-shadow: none !important;
          }
          button { display: none !important; }
        }
      `}</style>

      <div className="max-w-md mx-auto">
        {/* Branding Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
             {/* Replace this span with <img src="/your-logo.png" /> later */}
             <span className="text-white font-bold text-2xl">LAB</span>
          </div>
          <h1 className="text-3xl font-bold text-blue-900 text-center">Client Portal</h1>
          <p className="text-slate-500 text-sm">Sample Entry & Pre-Labeling</p>
        </div>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-8">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Sample Name</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
                placeholder="e.g. Raw Almonds"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Lot Number</label>
              <input 
                type="text" 
                className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                placeholder="e.g. LOT-2024-001"
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Matrix</label>
              <select 
                className="w-full border p-2 rounded bg-slate-50"
                value={matrix}
                onChange={(e) => setMatrix(e.target.value)}
              >
                <option>Powder</option>
                <option>Liquid</option>
                <option>Solid / Finished Good</option>
                <option>Environmental Swab</option>
              </select>
            </div>
          </div>

          {/* Analysis Selection: Critical for LIMS Integration */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase text-slate-500 mb-2">Requested Analysis</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border">
              {["Salmonella", "Listeria", "pH Level", "APC / Aerobic", "E. coli", "Yeast & Mold - Petrifilm", "Yeast & Mold - Pour Plate", "Coliform - Petrifilm", "Coliform - Pour Plate", "Water Activity"].map((test) => (
                <label key={test} className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-white p-1 rounded transition-all">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded text-blue-600 border-slate-300"
                    checked={selectedTests.includes(test)}
                    onChange={(e) => {
                      if(e.target.checked) setSelectedTests([...selectedTests, test]);
                      else setSelectedTests(selectedTests.filter(t => t !== test));
                    }}
                  />
                  <span className="text-slate-700">{test}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-md font-bold transition-all shadow-md">
            Generate Lab ID & Sticker
          </button>
        </form>

        {/* The Sticker: Styled for 2x4 Thermal Printers */}
        {savedId && (
          <div className="print-section mt-8 bg-white p-6 rounded-lg shadow-xl border-2 border-dashed border-blue-400 text-center">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Laboratory Sample Sticker</p>
            <h2 className="text-xl font-black text-slate-800 mb-2">{sampleName}</h2>
            
            <div className="flex justify-center mb-3">
              <QRCode 
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/receive?id=${savedId}`} 
                size={120} 
              />
            </div>

            <div className="space-y-1 mb-4">
              <p className="text-[12px] font-mono font-bold bg-slate-100 py-1 rounded">ID: {savedId.slice(0,8)}...</p>
              <p className="text-[10px] text-slate-500">Lot: {lotNumber} | Matrix: {matrix}</p>
            </div>

            <button 
              onClick={() => window.print()} 
              className="w-full py-2 bg-slate-800 text-white rounded font-bold hover:bg-black transition-colors"
            >
              Print to Thermal Printer
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

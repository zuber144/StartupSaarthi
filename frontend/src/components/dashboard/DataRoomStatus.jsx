import React from 'react';

const DataRoomStatus = () => {
  const docs = [
    { name: 'Pitch Deck V4', icon: 'description', status: 'Complete', color: 'text-primary' },
    { name: 'Financial Model', icon: 'analytics', status: 'In Progress', color: 'text-outline', badge: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Cap Table', icon: 'article', status: 'Missing', color: 'text-outline', badge: 'bg-error-container text-on-error-container' },
  ];

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-on-surface">Document Data Room</h3>
        <span className="material-symbols-outlined text-outline">folder_open</span>
      </div>
      <div className="space-y-3">
        {docs.map((doc, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:bg-surface-container-high/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined ${doc.color}`}>{doc.icon}</span>
              <span className="text-sm font-bold text-on-surface">{doc.name}</span>
            </div>
            {doc.status === 'Complete' ? (
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            ) : (
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${doc.badge}`}>
                {doc.status}
              </span>
            )}
          </div>
        ))}
      </div>
      <button className="w-full mt-6 py-2.5 border border-outline-variant/50 rounded-xl text-[13px] font-bold text-on-surface hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
        <span className="material-symbols-outlined text-lg">upload</span>
        Upload Document
      </button>
    </div>
  );
};

export default DataRoomStatus;

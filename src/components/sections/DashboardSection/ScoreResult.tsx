
import DashboardLayout from '../../../layout/Dashboard/dashboardlayout';

const ScoreResult = () => {
  return (
    <DashboardLayout>
      
<div className="p-6 bg-[#f9f9f9] min-h-screen font-[Poppins]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-[#222224]">Score & Results</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-[#222224] text-sm font-medium px-4 py-1.5 rounded-lg">Share</button>
          <button className="bg-[#ff6b81] text-white text-sm font-medium px-4 py-1.5 rounded-lg">Report</button>
        </div>
      </div>

      {/* Summary Cards */}

<div className="flex flex-wrap gap-2 mb-4" >
   <div
  className="w-[511px] h-[208px] p-3 rounded-[12px] border border-[#eceef2] shadow-sm"
  style={{
    background: 'linear-gradient(135deg, #f5f2fc 0%, #fef3f8 100%)',
  }}
>
  <div className="flex items-center justify-between border-b border-[#dadce0] pb-2 mb-3">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 bg-[#e3d1f6] rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-[#9747FF]">⚡</span>
      </div>
      <span className="text-sm font-medium text-[#222224]">Overall CIS Score</span>
    </div>
  </div>

  <div className="flex items-end gap-2 mb-3">
    <span className="text-[32px] font-bold text-[#9747FF] leading-none">72</span>
    <span className="text-sm font-semibold text-[#222224] mb-[2px]">/100</span>
  </div>

  <div className="w-full h-2 rounded-full bg-[#f3f3f3] overflow-hidden mb-1">
    <div className="w-[72%] h-2 rounded-full bg-gradient-to-r from-[#a392f2] to-[#f07eff]"></div>
  </div>

  <div className="flex justify-end text-xs text-[#222224] font-medium mb-1">100%</div>
  <div className="text-xs font-medium text-[#818181]">Above 70 is considered inspired</div>
</div>

        {/* Badge */}
<div
  className="w-[292px] h-[208px] p-3 rounded-[12px] border border-[#eceef2] shadow-sm bg-white flex flex-col justify-between"
>
  <div className="flex items-center justify-between border-b border-[#dadce0] pb-2 ">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-[#fff3c4] rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-[#FFCC00]">⚡</span>
      </div>
      <span className="text-sm font-medium text-[#222224]">Badge</span>
    </div>
    <div className="text-sm text-gray-400 cursor-pointer">⋯</div>
  </div>

  <div className="flex justify-center items-center h-full">
    <img
      src="/Inspired _ Badge.png"
      alt="CNESS Inspired"
      className="h-[48px] object-contain"
    />
  </div>
</div>

     
        {/* Certification Level */}
      <div className="w-[292px] h-[208px] bg-white rounded-[12px] p-3 shadow-sm border border-[#eceef2]">
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 bg-[#e2f2ff] rounded-full flex items-center justify-center">
        <img src="..\public\Vector.png" alt="icon" className="w-[12px] h-[12px]" />
      </div>
      <span className="text-sm font-semibold text-[#222224]">Certification Level</span>
    </div>
  </div>

  <div className="border-t border-[#e6e6e6] mb-10"></div>
<div className="flex justify-center items-center">
  <span className="px-18 py-4 bg-[#eaf9f5] text-[#00bfa5] text-sm font-semibold rounded-[12px] inline-block">
    Inspired
  </span>

  </div>
</div>
</div>


      {/* Metric Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#eceef2] p-4 shadow-sm">
          <div className="text-sm text-[#7a7a7a] font-medium mb-2">Quantitative Score</div>
          <div className="text-2xl font-semibold text-[#222224]">85 <span className="text-green-500 text-sm ml-1">↑ 5%</span></div>
        </div>
        <div className="bg-white rounded-xl border border-[#eceef2] p-4 shadow-sm">
          <div className="text-sm text-[#7a7a7a] font-medium mb-2">Qualitative Score</div>
          <div className="text-2xl font-semibold text-[#222224]">90 <span className="text-green-500 text-sm ml-1">↑ 9%</span></div>
        </div>
        <div className="bg-white rounded-xl border border-[#eceef2] p-4 shadow-sm">
          <div className="text-sm text-[#7a7a7a] font-medium mb-2">Improvement Score</div>
          <div className="text-2xl font-semibold text-[#222224]">75 <span className="text-red-500 text-sm ml-1">↓ 5%</span></div>
        </div>
      </div>

      {/* Section Tabs Placeholder */}
      <div className="flex flex-wrap gap-2 text-sm font-medium text-[#7a7a7a] mb-4">
        {['Ethical Leadership..', 'Social Equity, Diversity..', 'Freedom, Culture..', 'Environmental Steward..', 'Social Responsibility..', 'Consciousness and Leadership'].map(tab => (
          <div key={tab} className="bg-white px-4 py-2 border rounded-full cursor-pointer hover:bg-[#f1f1f1]">
            {tab}
          </div>
        ))}
      </div>

      {/* Score Breakdown */}
      <div className="bg-[#f9f6fe] p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-[#9747FF] mb-6">Ethical Leadership & Governance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CODE OF ETHICS / CORE VALUES', score: 79, status: 'Almost There', desc: 'Here are some tips on how to improve your score' },
            { label: 'ACCOUNTABILITY MECHANISMS', score: 100, status: 'Excellence!', desc: 'Here are some tips on how to improve your score' },
            { label: 'STAKEHOLDER INCLUSIVITY', score: 80, status: 'Verge of Completion!', desc: 'Here are some tips on how to improve your score' },
            { label: 'TRANSPARENCY REPORTING', score: 90, status: 'Almost Perfect!', desc: 'Here are some tips on how to improve your score' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-[#eceef2]">
              <div className="text-sm font-medium text-[#7a7a7a] mb-2">{item.label}</div>
              <div className="text-[32px] font-bold text-[#9747FF] mb-2">{item.score}</div>
              <div className="text-[#00b894] font-medium text-sm mb-1">{item.status}</div>
              <div className="text-xs text-[#7a7a7a]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>


    </DashboardLayout>
  );
};

export default ScoreResult;

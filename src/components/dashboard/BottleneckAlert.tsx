import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

interface BottleneckAlertProps {
  onReviewRecommendation?: () => void;
  onDismiss?: () => void;
}

export const BottleneckAlert: React.FC<BottleneckAlertProps> = ({ 
  onReviewRecommendation,
  onDismiss 
}) => {
  const navigate = useNavigate();

  const handleReview = () => {
    if (onReviewRecommendation) {
      onReviewRecommendation();
    } else {
      navigate('/copilot');
    }
  };

  return (
    <div className="bg-[#fffdfa] border-l-4 border-l-amber-600 border border-amber-200/80 rounded-xl p-5 shadow-xs transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Info */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                ✦ ENGINE PULSE
              </span>
              <h2 className="text-base font-bold text-slate-900 tracking-tight font-sans">
                Capacity Bottleneck Detected: Platform Engineering
              </h2>
              <span className="text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                Confidence 96.4%
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed max-w-4xl">
              <strong className="text-amber-900 font-semibold">Rahul</strong> is operating at{' '}
              <span className="font-bold text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                95% capacity
              </span>{' '}
              with 2 critical SLA tasks due within 8 hours. Priya and Arun hold an exact{' '}
              <span className="font-bold text-slate-900">94% skill match</span> across distributed systems telemetry with{' '}
              <span className="font-bold text-blue-700">58% combined available headroom</span>.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
            >
              Dismiss
            </button>
          )}

          <button
            onClick={handleReview}
            className="bg-[#795914] hover:bg-[#63480f] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition shadow-xs cursor-pointer active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Review Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};

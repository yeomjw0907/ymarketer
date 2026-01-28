import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { number: 1, label: '주문 확인' },
  { number: 2, label: '배송 정보' },
  { number: 3, label: '결제' },
];

export default function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* 스텝 원 */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center font-bold text-sm transition-colors ${
                    isCompleted
                      ? 'bg-black text-white'
                      : isCurrent
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : step.number}
                </div>
                <div
                  className={`mt-2 text-xs font-medium ${
                    isCurrent ? 'text-black' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </div>
              </div>

              {/* 연결선 */}
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-colors ${
                    step.number < currentStep ? 'bg-black' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

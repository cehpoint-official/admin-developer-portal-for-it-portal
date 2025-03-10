import { Check } from "lucide-react"

interface StepsProgressProps {
  currentStep: number
}

export function StepsProgress({ currentStep }: StepsProgressProps) {
  const steps = [
    { id: 1, name: "Project Details" },
    { id: 2, name: "Development Preferences" },
    { id: 3, name: "Documentation" },
    { id: 4, name: "Finish" },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id ? "bg-primary border-primary text-white" : "border-gray-300 text-gray-500"
              }`}
            >
              {currentStep > step.id ? <Check className="w-5 h-5" /> : <span>{step.id}</span>}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-1 w-10 sm:w-24 md:w-46 lg:w-64 mx-2 ${
                  currentStep > index + 1 ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-2 px-1 text-xs text-gray-500">
        {steps.map((step) => (
          <div key={`label-${step.id}`} className="w-20 text-center">
            {step.name}
          </div>
        ))}
      </div>
    </div>
  )
}


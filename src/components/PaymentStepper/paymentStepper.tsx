'use client'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

interface StepperProps {
  activeStep: number;
  steps: string[];
}

const PaymentStepper: React.FC<StepperProps> = ({ activeStep, steps }) => {
  return (
    <div className="w-full">
      <div className="flex justify-between items-center my-4">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-row items-center mr-2">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full 
              ${activeStep >= index ? 'bg-[#979317] text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {index === 0 && <InsertDriveFileIcon />}
              {index === 1 && <LocalAtmIcon />}
              {index === 2 && <ShoppingCartIcon />}
            </div>
            <span className={`text-center w-20 text-wrap ml-2 text-sm ${activeStep >= index ? 'text-black font-semibold' : 'text-gray-600'}`}>
              {label}
            </span>
            <div
              className={`mx-1 w-8 h-[1px] flex items-center justify-center 
              ${activeStep >= index ? 'bg-[#979317] text-white' : 'bg-gray-300 text-gray-600'} ${index === steps.length - 1 && 'hidden'}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentStepper;

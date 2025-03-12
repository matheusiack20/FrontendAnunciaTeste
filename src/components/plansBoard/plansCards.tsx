import CheckIcon from '@mui/icons-material/Check';
import React from 'react';

interface PlanPriceCardProps {
    isCheckedAnualMode: boolean;
    name: string;
    price: number;
    discount: number;
    benefits: string;
    onSubscribe: () => void;
}

const PlanPriceCard: React.FC<PlanPriceCardProps> = ({ isCheckedAnualMode, name, price, discount, benefits, onSubscribe }) => {
    const benefitsList = benefits.split(';').filter(benefit => benefit.trim() !== '');
    const finalPrice = isCheckedAnualMode ? price * (100 - discount) / 100 : price;
    return(
        <div className='select-none flex flex-col items-center border border-[#dafd00] w-[235px] text-center bg-[#282828] m-2 rounded-2xl min-h-[500px] h-auto pb-10'>
            <div id='plan_name' className='text-center m-4 bg-[#dafd00] w-auto min-w-[130px] px-4 py-1 rounded-3xl'>
                <h1 className='text-[20px] font-extrabold text-shadow text-white shad'>{name}</h1>
            </div>
            {isCheckedAnualMode && 
            <div id='tag_discount' className='mt-3 font-bold text-[12px] bg-green-600 rounded-sm px-2 py-1 text-white'>
                <span>{discount}% off</span>
            </div>}
            <div id='pricing' className='mt-5 mb-3 flex flex-col'>
                {isCheckedAnualMode && 
                    <span className='line-through text-[#929292] font-extrabold text-[20px]'>R$ {(price / 100).toFixed(2).replace('.',',')}</span>
                }
                <span className='text-white font-extrabold text-[20px]'>R$ {(finalPrice / 100).toFixed(2).replace('.',',')}</span>
            </div>
            <button id='button_buy_plan' className='text-[22px] bg-black text-white font-extrabold px-3 py-1 rounded-lg transition-all hover:bg-primary' onClick={onSubscribe}>Assinar Agora</button>
            <div className='my-5 w-[170px] h-2 border-b border-[#5F5E5E]'/>
            <div id='benfits_list' className='w-[180px] '>
                {benefitsList.map((benefit, index) => (
                    <div key={index} className='text-white flex items-center mb-1 text-[12px] lowercase'>
                        <CheckIcon className='text-[12px] mr-2' />
                        <span className=''>{benefit.trim()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlanPriceCard;
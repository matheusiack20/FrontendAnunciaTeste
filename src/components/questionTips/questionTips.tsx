import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Dica 1: Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      children: <p>{text}</p>,
    },
    {
      key: '2',
      label: 'Dica 2: Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      children: <p>{text}</p>,
    },
    {
      key: '3',
      label: 'Dica 3: Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      children: <p>{text}</p>,
    },
    {
        key: '4',
        label: 'Dica 4: Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
        children: <p>{text}</p>,
      },
  ];

const QuestionCollapse = () => {
    return(
        <Collapse className="custom-collapse bg-[#282828] border border-black" accordion items={items} />
    );
}

export default QuestionCollapse;
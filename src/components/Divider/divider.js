import { Divider } from 'primereact/divider';
export default function DividerComponent(props) {
  return (
    <main className={`${props.additionalClasses}`}>
      <Divider className={`${props.width} ${props.additionalClass} `} align={props.align} layout={`${props.layout ? props.layout : "horizontal"}`} type={`${props.type ? props.type : "solid"} ${props.additionalClass}`} />
    </main>
  );
}

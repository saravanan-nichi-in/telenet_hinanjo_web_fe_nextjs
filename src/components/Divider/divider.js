import { Divider } from 'primereact/divider';
export default function DividerComponent(props) {
  return (
    <main className={`${props.parentClass}`}>
      <Divider className={`${props.width} ${props.dividerClass} `} align={props.align} layout={`${props.layout ? props.layout : "horizontal"}`} type={`${props.type ? props.type : "solid"} `} />
    </main>
  );
}

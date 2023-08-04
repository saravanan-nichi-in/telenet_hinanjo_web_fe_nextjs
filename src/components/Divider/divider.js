"use client";

import { Divider } from 'primereact/divider';


export default function DividerComponent(props) {
  return (
    <main>
        <Divider className={`${props.width}`}align={props.align} layout={`${props.layout ? props.layout :"horizontal"}`}type={`${props.type ? props.type :"solid"} ${props.additionalClass}`}  />
    </main>
  );
}

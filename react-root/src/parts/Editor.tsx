import React, { JSXElementConstructor, memo, ReactElement, Ref, useMemo, useRef } from 'react';
import { NavigationContainer } from './Containers';

interface DataList {
    list: string[],
    name: string,
}

interface BindFragmentProps {
    list: DataList,
    ref?: Ref<any>,
    placeholder?: string,
    hasSecondaryValue?: boolean
}

interface FragmentSuggestionOptions {
    list: DataList
}

const FragmentSuggestion = memo(function(props: FragmentSuggestionOptions) {
     return (
        <datalist id={props.list.name}>
            {props.list.list.map(listitem => <option value={listitem}></option>)}
         </datalist>
    );
});

function BindFragment(props: BindFragmentProps)  {
    return (
        <form>
            <input className='border border-blue' list={props.list.name} type='text' placeholder={ props.placeholder || '' }></input>
            <FragmentSuggestion list={props.list} />
        </form>
    );
}

function Fragment_BindType () {
    const dataList: DataList = {
        list: ['bind', 'BindToggle'],
        name: 'datalist-bindtype'
    }

    return (
        <BindFragment list={dataList} />
    );
}

function Fragment_Key () {
    const dataList: DataList = {
        list: [],
        name: 'datalist-key'
    }

    return (
        <BindFragment list={dataList} />
    );
}

function Fragment_Command () {
    const dataList: DataList = {
        list: [],
        name: 'datalist-command'
    }

    return (
        <BindFragment list={dataList} hasSecondaryValue />
    )
}

function BindView() {
    return (
        <div className='flex flex-row gap-5'>
            <Fragment_BindType />
            <Fragment_Key />
            <Fragment_Command />
        </div>
    );
}

function EditorBody() {
    return (
        <form className='m-5 border border-black'>
            <BindView />
        </form>
    );
}

function Editor() {
    return (
        <div>
            <NavigationContainer>
                <span>hello</span>
            </NavigationContainer>
            <EditorBody />
        </div>
    );
}

export default Editor;

'use strict';
const resultNode=document.getElementById('result');
const expressionNode=document.getElementById('expression');
const keypad=document.querySelector('.keypad');
const installButton=document.getElementById('install-button');
let current='0',previous=null,pendingOperator=null,replaceOnDigit=false,lastOperator=null,lastOperand=null,expression='';
const operations={'+':(a,b)=>a+b,'-':(a,b)=>a-b,'*':(a,b)=>a*b,'/':(a,b)=>b===0?NaN:a/b};
const symbols={'+':'+','-':'−','*':'×','/':'÷'};
const pretty=value=>String(value).replace(/\./g,',');
function render(){resultNode.textContent=current==='Hiba'?'Hiba':pretty(current);resultNode.classList.toggle('compact',resultNode.textContent.length>11);expressionNode.textContent=expression||'\u00a0'}
function clearAll(){current='0';previous=null;pendingOperator=null;replaceOnDigit=false;lastOperator=null;lastOperand=null;expression='';render()}
function formatNumber(value){if(!Number.isFinite(value))return 'Hiba';if(value===0)return '0';const rounded=Number(value.toPrecision(12));const txt=String(rounded);return txt.length<=14?txt:rounded.toExponential(7)}
function digit(value){if(current==='Hiba')clearAll();if(replaceOnDigit){if(pendingOperator===null)expression='';current=value;replaceOnDigit=false;if(pendingOperator===null){lastOperator=null;lastOperand=null}}else if(current==='0'){current=value}else if(current==='-0'){current='-'+value}else if(current.replace(/[^0-9]/g,'').length<12){current+=value}render()}
function decimal(){if(current==='Hiba')clearAll();if(replaceOnDigit){if(pendingOperator===null)expression='';current='0.';replaceOnDigit=false;if(pendingOperator===null){lastOperator=null;lastOperand=null}}else if(!current.includes('.'))current+='.';render()}
function backspace(){if(current==='Hiba'){clearAll();return}if(replaceOnDigit){if(pendingOperator===null)expression='';replaceOnDigit=false}current=current.length<=1||(current.length===2&&current[0]==='-')?'0':current.slice(0,-1);render()}
function toggleSign(){if(current==='Hiba')return;current=current.startsWith('-')?current.slice(1):'-'+current;replaceOnDigit=false;render()}
function percentage(){if(current==='Hiba')return;let percent=Number(current)/100;if(previous!==null&&(pendingOperator==='+'||pendingOperator==='-'))percent=previous*Number(current)/100;current=formatNumber(percent);replaceOnDigit=false;render()}
function chooseOperator(op){if(current==='Hiba')return;if(previous!==null&&pendingOperator&&!replaceOnDigit){const calculated=formatNumber(operations[pendingOperator](previous,Number(current)));current=calculated;if(calculated==='Hiba'){previous=null;pendingOperator=null;expression='';render();return}}previous=Number(current);pendingOperator=op;replaceOnDigit=true;lastOperator=null;lastOperand=null;expression=pretty(current)+' '+symbols[op];render()}
function equals(){if(current==='Hiba')return;if(pendingOperator&&previous!==null){const right=replaceOnDigit?previous:Number(current);const left=previous;current=formatNumber(operations[pendingOperator](left,right));expression=pretty(left)+' '+symbols[pendingOperator]+' '+pretty(right)+' =';lastOperator=pendingOperator;lastOperand=right;previous=null;pendingOperator=null}else if(lastOperator&&lastOperand!==null){const left=Number(current);current=formatNumber(operations[lastOperator](left,lastOperand));expression=pretty(left)+' '+symbols[lastOperator]+' '+pretty(lastOperand)+' ='}replaceOnDigit=true;render()}
function action(name,value){switch(name){case'clear':clearAll();break;case'digit':digit(value);break;case'decimal':decimal();break;case'backspace':backspace();break;case'sign':toggleSign();break;case'percent':percentage();break;case'operator':chooseOperator(value);break;case'equals':equals();break}}
keypad.addEventListener('click',event=>{const b=event.target.closest('button[data-action]');if(b)action(b.dataset.action,b.dataset.value)});
document.addEventListener('keydown',event=>{if(event.ctrlKey||event.metaKey||event.altKey)return;const k=event.key;if(/^[0-9]$/.test(k))action('digit',k);else if(k===','||k==='.')action('decimal');else if(['+','-','*','/'].includes(k))action('operator',k);else if(k==='Enter'||k==='=')action('equals');else if(k==='Backspace')action('backspace');else if(k==='Escape'||k==='Delete')action('clear');else if(k==='%')action('percent');else return;event.preventDefault()});
if('serviceWorker'in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('./sw.js').catch(error=>console.warn('Offline funkció nem elérhető:',error))})}
let installPrompt=null;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;installButton.hidden=false});
installButton.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;installButton.hidden=true});
window.addEventListener('appinstalled',()=>{installButton.hidden=true});render();

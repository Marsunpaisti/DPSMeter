import { useEffect, useRef } from 'react';
import { IpcChannels } from '../shared/channels';
import { getIpcRenderer } from './getIpcRenderer';

export const useMouseEnabler = () => {
  const mouseEnableRef = useRef<HTMLElement | undefined>();
  useEffect(() => {
    if (!mouseEnableRef.current) return;

    const element = mouseEnableRef.current;

    const callback = (e: MouseEvent) => {
      let iterNode = e.target as any;
      let found = false;
      while (iterNode) {
        if (iterNode === element) {
          found = true;
          break;
        }
        iterNode = iterNode.parentNode;
      }

      if (found) {
        getIpcRenderer()?.send(IpcChannels.DISABLE_MOUSE_PASSTHROUGH);
      } else {
        getIpcRenderer()?.send(IpcChannels.ENABLE_MOUSE_PASSTHROUGH);
      }
    };

    window.addEventListener('mousemove', callback);
    return () => {
      window.removeEventListener('mousemove', callback);
    };
  }, [mouseEnableRef]);

  return {
    mouseEnableRef,
  };
};

import React from 'react';
import { createRoot } from 'react-dom/client';
import ExtensionController from './extension-controller';

const root = document.getElementById("root");

createRoot(root).render(
  <React.StrictMode>
    <ExtensionController />
  </React.StrictMode>
);


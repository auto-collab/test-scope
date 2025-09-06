import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AzureDevOpsProvider } from '../../app/contexts/azure-devops-context';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  skipProvider?: boolean;
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AzureDevOpsProvider>
      <div data-testid="azure-devops-provider">
        {children}
      </div>
    </AzureDevOpsProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions,
) => {
  const { skipProvider = false, ...renderOptions } = options || {};
  
  if (skipProvider) {
    return render(ui, renderOptions);
  }
  
  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

export * from '@testing-library/react';
export { customRender as render };

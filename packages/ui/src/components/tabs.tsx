"use client";
import { cn } from "@workspace/ui/lib/utils";
import * as React from "react";

type Orientation = "horizontal" | "vertical";

type TabsContextValue = {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
  orientation: Orientation;
  register: (
    val: string,
    ref: React.RefObject<HTMLButtonElement | null>,
  ) => void;
  getOrdered: () => Array<{
    value: string;
    ref: React.RefObject<HTMLButtonElement | null>;
  }>;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabsContext(component: string): TabsContextValue {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error(`${component} must be used within <Tabs />`);
  return ctx;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  orientation?: Orientation;
  children: React.ReactNode;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  orientation = "horizontal",
  className,
  children,
  ...rest
}: TabsProps) {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = React.useState<string>(
    defaultValue ?? "",
  );
  const active = isControlled ? (value as string) : uncontrolled;
  const setValue = React.useCallback(
    (v: string) => {
      if (isControlled) onValueChange?.(v);
      else setUncontrolled(v);
    },
    [isControlled, onValueChange],
  );
  const baseId = React.useId();
  const registry = React.useRef(
    new Map<string, React.RefObject<HTMLButtonElement | null>>(),
  );
  const register = React.useCallback(
    (val: string, ref: React.RefObject<HTMLButtonElement | null>) => {
      registry.current.set(val, ref);
    },
    [],
  );
  const getOrdered = React.useCallback(() => {
    return Array.from(registry.current.entries()).map(([value, ref]) => ({
      value,
      ref,
    }));
  }, []);

  const ctx: TabsContextValue = React.useMemo(
    () => ({
      value: active,
      setValue,
      baseId,
      orientation,
      register,
      getOrdered,
    }),
    [active, baseId, orientation, register, getOrdered, setValue],
  );

  return (
    <div data-ui="tabs" className={cn("w-full", className)} {...rest}>
      <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>
    </div>
  );
}

export type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export function TabsList({ className, children, ...rest }: TabsListProps) {
  const { orientation, baseId } = useTabsContext("TabsList");
  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      id={`${baseId}-tablist`}
      className={cn(
        "flex gap-2",
        orientation === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  value: string;
}

export function TabsTrigger({
  value,
  className,
  onClick,
  onKeyDown,
  ...rest
}: TabsTriggerProps) {
  const {
    value: active,
    setValue,
    baseId,
    register,
    getOrdered,
    orientation,
  } = useTabsContext("TabsTrigger");
  const selected = active === value;
  const ref = React.useRef<HTMLButtonElement | null>(null);
  React.useEffect(() => register(value, ref), [register, value]);

  const tabIndex = selected ? 0 : -1;

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (e) => {
    onKeyDown?.(e);
    const keys = [
      "ArrowRight",
      "ArrowLeft",
      "Home",
      "End",
      "ArrowDown",
      "ArrowUp",
    ];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const items = getOrdered();
    const idx = items.findIndex((it) => it.value === value);
    const last = items.length - 1;
    let nextIdx = idx;
    const isHorizontal = orientation === "horizontal";
    if (e.key === "Home") nextIdx = 0;
    else if (e.key === "End") nextIdx = last;
    else if (
      (isHorizontal && e.key === "ArrowRight") ||
      (!isHorizontal && e.key === "ArrowDown")
    )
      nextIdx = idx === last ? 0 : idx + 1;
    else if (
      (isHorizontal && e.key === "ArrowLeft") ||
      (!isHorizontal && e.key === "ArrowUp")
    )
      nextIdx = idx === 0 ? last : idx - 1;
    const next = items[nextIdx];
    if (next) {
      setValue(next.value);
      next.ref.current?.focus();
    }
  };

  return (
    <button
      ref={ref}
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={tabIndex}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40",
        selected
          ? "bg-th-light-100 text-th-dark-900 border-th-dark-900"
          : "bg-transparent text-th-dark-700 border-th-neutral-300 hover:bg-th-light-200",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        setValue(value);
      }}
      onKeyDown={handleKeyDown}
      {...rest}
    />
  );
}

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  lazyMount?: boolean;
}

export function TabsContent({
  value,
  className,
  children,
  lazyMount = false,
  ...rest
}: TabsContentProps) {
  const { value: active, baseId } = useTabsContext("TabsContent");
  const selected = active === value;
  const [mounted, setMounted] = React.useState(selected);
  React.useEffect(() => {
    if (selected) setMounted(true);
  }, [selected]);
  if (lazyMount && !mounted && !selected) return null;
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      className={cn(selected ? "block" : "hidden", className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export const TabsPrimitive = { Tabs, TabsList, TabsTrigger, TabsContent };

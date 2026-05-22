import { Calculator, FlaskConical, Ruler, X } from 'lucide-react';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addDependencies,
  cosDependencies,
  create,
  divideDependencies,
  eDependencies,
  evaluateDependencies,
  formatDependencies,
  log10Dependencies,
  multiplyDependencies,
  piDependencies,
  powDependencies,
  sinDependencies,
  sqrtDependencies,
  subtractDependencies,
  tanDependencies,
  unaryMinusDependencies,
  unaryPlusDependencies,
  unitDependencies,
} from 'mathjs';

type CalculatorTool = 'scientific' | 'units' | null;

type UnitOption = {
  label: string;
  value: string;
};

type UnitCategory = {
  label: string;
  units: UnitOption[];
};

const unitCategories: Record<string, UnitCategory> = {
  length: {
    label: 'Comprimento',
    units: [
      { label: 'Milimetro (mm)', value: 'mm' },
      { label: 'Centimetro (cm)', value: 'cm' },
      { label: 'Metro (m)', value: 'm' },
      { label: 'Quilometro (km)', value: 'km' },
      { label: 'Polegada (inch)', value: 'inch' },
      { label: 'Pe (ft)', value: 'ft' },
    ],
  },
  area: {
    label: 'Area',
    units: [
      { label: 'Milimetro quadrado', value: 'mm^2' },
      { label: 'Centimetro quadrado', value: 'cm^2' },
      { label: 'Metro quadrado', value: 'm^2' },
      { label: 'Quilometro quadrado', value: 'km^2' },
      { label: 'Polegada quadrada', value: 'inch^2' },
      { label: 'Pe quadrado', value: 'ft^2' },
    ],
  },
  volume: {
    label: 'Volume',
    units: [
      { label: 'Centimetro cubico', value: 'cm^3' },
      { label: 'Metro cubico', value: 'm^3' },
      { label: 'Mililitro (mL)', value: 'mL' },
      { label: 'Litro (L)', value: 'L' },
      { label: 'Polegada cubica', value: 'inch^3' },
      { label: 'Pe cubico', value: 'ft^3' },
    ],
  },
  mass: {
    label: 'Massa',
    units: [
      { label: 'Miligrama (mg)', value: 'mg' },
      { label: 'Grama (g)', value: 'g' },
      { label: 'Quilograma (kg)', value: 'kg' },
      { label: 'Tonelada (tonne)', value: 'tonne' },
      { label: 'Libra (lb)', value: 'lb' },
    ],
  },
  force: {
    label: 'Forca',
    units: [
      { label: 'Newton (N)', value: 'N' },
      { label: 'Quilonewton (kN)', value: 'kN' },
      { label: 'Libra-forca (lbf)', value: 'lbf' },
    ],
  },
  pressure: {
    label: 'Pressao',
    units: [
      { label: 'Pascal (Pa)', value: 'Pa' },
      { label: 'Quilopascal (kPa)', value: 'kPa' },
      { label: 'Megapascal (MPa)', value: 'MPa' },
      { label: 'Bar', value: 'bar' },
      { label: 'PSI', value: 'psi' },
    ],
  },
  temperature: {
    label: 'Temperatura',
    units: [
      { label: 'Celsius (degC)', value: 'degC' },
      { label: 'Fahrenheit (degF)', value: 'degF' },
      { label: 'Kelvin (K)', value: 'K' },
    ],
  },
};

const scientificButtons = [
  '7', '8', '9', '/', 'sin(',
  '4', '5', '6', '*', 'cos(',
  '1', '2', '3', '-', 'tan(',
  '0', '.', 'pi', '+', 'sqrt(',
  '(', ')', '^', 'e', 'log10(',
];

const math = create({
  addDependencies,
  cosDependencies,
  divideDependencies,
  eDependencies,
  evaluateDependencies,
  formatDependencies,
  log10Dependencies,
  multiplyDependencies,
  piDependencies,
  powDependencies,
  sinDependencies,
  sqrtDependencies,
  subtractDependencies,
  tanDependencies,
  unaryMinusDependencies,
  unaryPlusDependencies,
  unitDependencies,
});

export function CalculatorsPage() {
  const [activeTool, setActiveTool] = useState<CalculatorTool>(null);

  return (
    <section className="w-full space-y-4">
      <header className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-6">
        <p className="text-xs font-semibold uppercase text-[var(--text-muted)]">Calculadoras</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)] sm:text-3xl">Ferramentas rapidas de estudo</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
          Abra uma ferramenta sem sair da trilha para conferir expressoes e converter unidades de engenharia.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <ToolCard
          title="Calculadora cientifica"
          description="Expressoes, potencias, trigonometria, raizes, logaritmos e constantes."
          icon={<Calculator className="h-5 w-5" />}
          action="Abrir calculadora"
          onClick={() => setActiveTool('scientific')}
        />
        <ToolCard
          title="Conversor de unidades"
          description="Comprimento, area, volume, massa, forca, pressao e temperatura."
          icon={<Ruler className="h-5 w-5" />}
          action="Abrir conversor"
          onClick={() => setActiveTool('units')}
        />
      </div>

      <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--surface-soft)] text-[var(--accent)]">
            <FlaskConical className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)]">Conferencia antes de aplicar</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Use as ferramentas para validar passos intermediários. A decisão técnica continua no raciocínio da resolução.
            </p>
          </div>
        </div>
      </article>

      <CalculatorModal
        isOpen={activeTool === 'scientific'}
        title="Calculadora cientifica"
        onClose={() => setActiveTool(null)}
      >
        <ScientificCalculator />
      </CalculatorModal>

      <CalculatorModal
        isOpen={activeTool === 'units'}
        title="Conversor de unidades"
        onClose={() => setActiveTool(null)}
      >
        <UnitConverter />
      </CalculatorModal>
    </section>
  );
}

function ToolCard({
  title,
  description,
  icon,
  action,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  action: string;
  onClick: () => void;
}) {
  return (
    <article className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm shadow-black/5 sm:p-5">
      <span className="grid h-10 w-10 place-items-center rounded-md bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]">{icon}</span>
      <h2 className="mt-4 text-xl font-semibold text-[var(--text)]">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      <button className="iso-button-primary mt-5 gap-2 px-4 text-sm" type="button" onClick={onClick}>
        {action}
      </button>
    </article>
  );
}

function CalculatorModal({
  children,
  isOpen,
  title,
  onClose,
}: {
  children: ReactNode;
  isOpen: boolean;
  title: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="calculator-modal-title"
        aria-modal="true"
        role="dialog"
        className="my-auto w-full max-w-3xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/30"
      >
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 sm:px-5">
          <h2 id="calculator-modal-title" className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <button
            aria-label={`Fechar ${title}`}
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-soft)] transition hover:border-[var(--accent-border)] hover:text-[var(--text)]"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-4 sm:p-5">{children}</div>
      </section>
    </div>
  );
}

function ScientificCalculator() {
  const [expression, setExpression] = useState('sin(pi / 6) + sqrt(81)');
  const [result, setResult] = useState('9.5');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<Array<{ expression: string; result: string }>>([]);

  const calculate = () => {
    const trimmed = expression.trim();

    if (!trimmed || trimmed.length > 180 || /[;{}[\]=]/.test(trimmed)) {
      setError('Use uma expressão matemática curta, sem atribuições.');
      return;
    }

    try {
      const evaluated = math.evaluate(trimmed);
      const nextResult = math.format(evaluated, { precision: 14 });
      setResult(nextResult);
      setError('');
      setHistory((previous) => [{ expression: trimmed, result: nextResult }, ...previous].slice(0, 4));
    } catch {
      setError('Não consegui calcular essa expressão. Revise parênteses e funções.');
    }
  };

  const append = (value: string) => {
    setExpression((current) => `${current}${value}`);
    setError('');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_15rem]">
      <div>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Expressao</span>
          <input
            className="h-14 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-4 text-lg text-[var(--text)] outline-none transition focus:border-[var(--accent-border)]"
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                calculate();
              }
            }}
          />
        </label>

        <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">Resultado</span>
          <strong className="numeric mt-2 block break-all text-2xl font-semibold text-[var(--text)]">{result}</strong>
        </div>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
        )}

        <div className="mt-4 grid grid-cols-5 gap-2">
          {scientificButtons.map((button) => (
            <button
              key={button}
              className="min-h-11 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-sm font-semibold text-[var(--text)] transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
              onClick={() => append(button)}
              type="button"
            >
              {button}
            </button>
          ))}
        </div>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <button className="iso-button-soft gap-2 px-4" onClick={() => setExpression('')} type="button">Limpar</button>
          <button className="iso-button-soft gap-2 px-4" onClick={() => setExpression((current) => current.slice(0, -1))} type="button">Apagar</button>
          <button className="iso-button-primary gap-2 px-4" onClick={calculate} type="button">Calcular</button>
        </div>
      </div>

      <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">Atalhos aceitos</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Use `^` para potencia, `pi`, `e`, `sin`, `cos`, `tan`, `sqrt` e `log10`.
        </p>
        <div className="mt-4 border-t border-[var(--border)] pt-3">
          <h3 className="text-sm font-semibold text-[var(--text)]">Historico</h3>
          <div className="mt-2 space-y-2">
            {history.length === 0 && <p className="text-sm text-[var(--text-muted)]">Sem calculos nesta sessao.</p>}
            {history.map((item) => (
              <button
                key={`${item.expression}-${item.result}`}
                className="block w-full rounded-md border border-[var(--border)] bg-[var(--surface)] p-2 text-left transition hover:border-[var(--accent-border)]"
                onClick={() => setExpression(item.expression)}
                type="button"
              >
                <span className="block truncate text-xs text-[var(--text-muted)]">{item.expression}</span>
                <strong className="numeric mt-1 block truncate text-sm text-[var(--text)]">{item.result}</strong>
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function UnitConverter() {
  const [categoryKey, setCategoryKey] = useState('length');
  const currentCategory = unitCategories[categoryKey];
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState(currentCategory.units[2]?.value ?? currentCategory.units[0].value);
  const [toUnit, setToUnit] = useState(currentCategory.units[1]?.value ?? currentCategory.units[0].value);

  useEffect(() => {
    setFromUnit(currentCategory.units[0].value);
    setToUnit(currentCategory.units[1]?.value ?? currentCategory.units[0].value);
  }, [currentCategory]);

  const conversion = useMemo(() => {
    const numericValue = Number(value.replace(',', '.'));

    if (!Number.isFinite(numericValue)) {
      return { result: '', error: 'Informe um valor numérico válido.' };
    }

    try {
      const converted = math.unit(numericValue, fromUnit).toNumber(toUnit);
      return { result: math.format(converted, { precision: 12 }), error: '' };
    } catch {
      return { result: '', error: 'Essas unidades não podem ser convertidas entre si.' };
    }
  }, [fromUnit, toUnit, value]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_17rem]">
      <div className="space-y-3">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Grandeza</span>
          <select
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-border)]"
            value={categoryKey}
            onChange={(event) => setCategoryKey(event.target.value)}
          >
            {Object.entries(unitCategories).map(([key, category]) => (
              <option key={key} value={key}>{category.label}</option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[var(--text-muted)]">Valor</span>
            <input
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-border)]"
              inputMode="decimal"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
          <UnitSelect label="De" options={currentCategory.units} value={fromUnit} onChange={setFromUnit} />
          <UnitSelect label="Para" options={currentCategory.units} value={toUnit} onChange={setToUnit} />
        </div>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-4">
          <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">Conversao</span>
          {conversion.error ? (
            <p className="mt-2 text-sm text-red-300">{conversion.error}</p>
          ) : (
            <strong className="numeric mt-2 block break-all text-2xl font-semibold text-[var(--text)]">
              {conversion.result} {toUnit}
            </strong>
          )}
        </div>
      </div>

      <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3">
        <h3 className="text-sm font-semibold text-[var(--text)]">Escopo do conversor</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Presets iniciais para grandezas frequentes em estudo de engenharia, incluindo pressao, forca e temperatura.
        </p>
        <button
          className="iso-button-soft mt-4 w-full gap-2 px-3 text-sm"
          onClick={() => {
            setFromUnit(toUnit);
            setToUnit(fromUnit);
          }}
          type="button"
        >
          Inverter unidades
        </button>
      </aside>
    </div>
  );
}

function UnitSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: UnitOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[var(--text-muted)]">{label}</span>
      <select
        className="h-11 w-full rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] px-3 text-[var(--text)] outline-none transition focus:border-[var(--accent-border)]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
}

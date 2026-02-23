import { http, HttpResponse } from 'msw';
import type { Designer } from '../../../entities/designer/model/types';

const STORAGE_KEY = 'designers';

const defaultData: Designer[] = [
  { id: "1", fullName: "Mansur Aliyev", workingHours: 8, attachedObjectsCount: 0 },
  { id: "2", fullName: "Emin Mehdiyev", workingHours: 6, attachedObjectsCount: 0 },
];


const loadFromStorage = (): Designer[] => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    const initial = [...defaultData];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  return JSON.parse(data) as Designer[];
};

const saveToStorage = (data: Designer[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const handlers = [

  http.get('/api/designers', () => {
    const data = loadFromStorage();
    return HttpResponse.json(data);
  }),

  http.post('/api/designers', async ({ request }) => {
    const body = (await request.json()) as Partial<Designer>;
    const data = loadFromStorage();

    const newDesigner: Designer = {
      id: crypto.randomUUID(),
      fullName: body.fullName ?? "Без имени",
      workingHours: body.workingHours ?? 8,
      attachedObjectsCount: 0,
    };

    saveToStorage([...data, newDesigner]);

    return HttpResponse.json(newDesigner, { status: 201 });
  }),

  http.put('/api/designers/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<Designer>;
    const data = loadFromStorage();
    const index = data.findIndex((d) => d.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    data[index] = { ...data[index], ...body, id: data[index].id };
    saveToStorage(data);
    return HttpResponse.json(data[index]);
  }),

  http.delete('/api/designers/:id', ({ params }) => {
    const { id } = params;
    const data = loadFromStorage();
    const filtered = data.filter((d) => d.id !== id);
    saveToStorage(filtered);
    return new HttpResponse(null, { status: 204 });
  }),
];

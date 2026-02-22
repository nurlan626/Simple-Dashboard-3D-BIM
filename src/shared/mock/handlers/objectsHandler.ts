import { http, HttpResponse } from 'msw';
import type { SceneObject } from '../../../entities/object/model/types';
import type { Designer } from '../../../entities/designer/model/types';

const OBJECTS_STORAGE_KEY = 'scene_objects';
const DESIGNERS_STORAGE_KEY = 'designers';

const loadDesigners = (): Designer[] => {
  const data = localStorage.getItem(DESIGNERS_STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data) as Designer[];
};

const saveDesigners = (data: Designer[]) => {
  localStorage.setItem(DESIGNERS_STORAGE_KEY, JSON.stringify(data));
};

const loadFromStorage = (): SceneObject[] => {
  const data = localStorage.getItem(OBJECTS_STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data) as SceneObject[];
};

const saveToStorage = (data: SceneObject[]) => {
  localStorage.setItem(OBJECTS_STORAGE_KEY, JSON.stringify(data));
};

function updateDesignerObjectCount(designerId: string, delta: number) {
  const designers = loadDesigners();
  const index = designers.findIndex((d) => d.id === designerId);
  if (index === -1) return;
  designers[index] = {
    ...designers[index],
    attachedObjectsCount: Math.max(0, designers[index].attachedObjectsCount + delta),
  };
  saveDesigners(designers);
}

export const handlers = [
  http.get('/api/objects', () => {
    const data = loadFromStorage();
    return HttpResponse.json(data);
  }),

  http.post('/api/objects', async ({ request }) => {
    const body = (await request.json()) as Omit<SceneObject, 'id'>;
    const data = loadFromStorage();
    const newObject: SceneObject = {
      id: crypto.randomUUID(),
      name: body.name ?? 'Object',
      attachedDesignerId: body.attachedDesignerId,
      color: body.color ?? '#6b7280',
      position: body.position ?? { x: 0, y: 0, z: 0 },
      size: body.size ?? 'normal',
    };
    saveToStorage([...data, newObject]);
    updateDesignerObjectCount(newObject.attachedDesignerId, 1);
    return HttpResponse.json(newObject, { status: 201 });
  }),

  http.put('/api/objects/:id', async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as Partial<SceneObject>;
    const data = loadFromStorage();
    const index = data.findIndex((o) => o.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });
    const prev = data[index];
    const designerDelta =
      body.attachedDesignerId !== undefined && body.attachedDesignerId !== prev.attachedDesignerId
        ? { oldId: prev.attachedDesignerId, newId: body.attachedDesignerId }
        : null;
    if (designerDelta) {
      updateDesignerObjectCount(designerDelta.oldId, -1);
      updateDesignerObjectCount(designerDelta.newId, 1);
    }
    const updated: SceneObject = {
      ...prev,
      ...body,
      id: prev.id,
    };
    data[index] = updated;
    saveToStorage(data);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/objects/:id', ({ params }) => {
    const { id } = params;
    const data = loadFromStorage();
    const obj = data.find((o) => o.id === id);
    if (!obj) return new HttpResponse(null, { status: 404 });
    const filtered = data.filter((o) => o.id !== id);
    saveToStorage(filtered);
    updateDesignerObjectCount(obj.attachedDesignerId, -1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete('/api/objects', () => {
    const objects = loadFromStorage();
    objects.forEach((obj) => {
      updateDesignerObjectCount(obj.attachedDesignerId, -1);
    });
    saveToStorage([]);
    return new HttpResponse(null, { status: 204 });
  }),
];

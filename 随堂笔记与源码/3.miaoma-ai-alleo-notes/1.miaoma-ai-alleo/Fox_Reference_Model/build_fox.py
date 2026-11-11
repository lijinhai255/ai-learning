"""Create an editable reference-inspired red fox and two studio views."""
import bpy
import math
import os
import random
import bisect
from mathutils import Vector

random.seed(41)
OUT = os.path.dirname(os.path.abspath(__file__))
scene = bpy.data.scenes.new('Red Fox | Autumn approach')
bpy.context.window.scene = scene
groups = {}
for key, name in [('body', '01 Fox - body sculpt'), ('face', '02 Fox - face and ears'), ('fur', '03 Fox - directional fur'), ('stage', '04 Studio and road'), ('reference', '05 Photograph reference')]:
    col = bpy.data.collections.new(name)
    scene.collection.children.link(col)
    groups[key] = col


def move(obj, key='body'):
    for col in list(obj.users_collection):
        col.objects.unlink(obj)
    groups[key].objects.link(obj)
    return obj


def material(name, color, roughness=.6, noise=False):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    shader = nodes.get('Principled BSDF')
    shader.inputs['Base Color'].default_value = (*color, 1)
    shader.inputs['Roughness'].default_value = roughness
    if name.startswith('Hair'):
        shader.inputs['Specular IOR Level'].default_value = .22
    if noise:
        tex = nodes.new('ShaderNodeTexNoise')
        tex.inputs['Scale'].default_value = 95
        tex.inputs['Detail'].default_value = 2
        ramp = nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = (*(c * .65 for c in color), 1)
        ramp.color_ramp.elements[1].color = (*(min(c * 1.2, 1) for c in color), 1)
        links.new(tex.outputs['Fac'], ramp.inputs[0])
        links.new(ramp.outputs[0], shader.inputs['Base Color'])
        bump = nodes.new('ShaderNodeBump')
        bump.inputs['Strength'].default_value = .18
        bump.inputs['Distance'].default_value = .012
        links.new(tex.outputs['Fac'], bump.inputs['Height'])
        links.new(bump.outputs['Normal'], shader.inputs['Normal'])
    return mat


rust = material('Coat | burnt copper', (.47, .128, .029), .77, True)
cream = material('Coat | warm ivory', (.79, .73, .61), .8, True)
blackcoat = material('Coat | charcoal stockings', (.014, .010, .008), .8, True)
nosemat = material('Nose | textured wet leather', (.008, .011, .013), .29, True)
lidmat = material('Eyes | dark eyelids', (.015, .009, .006), .48)
amber = material('Eyes | golden amber iris', (.34, .13, .016), .29, True)
pupilmat = material('Eyes | jet pupils', (.001, .002, .003), .14)
mouthmat = material('Mouth | dark umber', (.035, .008, .008), .58)
horn = material('Claws | dark horn', (.049, .036, .022), .5)
pink = material('Ear | muted inner skin', (.22, .095, .048), .85)
whiskermat = material('Whiskers | warm charcoal', (.10, .074, .042), .58)
fur_colors = [( .40, .075, .012), (.55, .15, .030), (.69, .235, .052), (.80, .33, .10), (.31, .055, .012), (.53, .19, .057), (.76, .47, .20)]
copper_hairs = [material('Hair | copper %02d' % i, c, .67) for i, c in enumerate(fur_colors)]
white_hairs = [material('Hair | ivory %02d' % i, c, .75) for i, c in enumerate([(.70, .65, .54), (.89, .84, .71), (.49, .43, .32)])]
black_hairs = [material('Hair | soot %02d' % i, c, .74) for i, c in enumerate([(.009, .008, .007), (.026, .016, .011), (.064, .034, .018)])]


def uv(name, loc, scale, mat, group='body', segments=40, rings=28, rotation=None):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=loc)
    obj = bpy.context.object
    obj.name, obj.scale = name, scale
    if rotation:
        obj.rotation_euler = rotation
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(mat)
    for p in obj.data.polygons:
        p.use_smooth = True
    return move(obj, group)


def between(name, a, b, radius, mat):
    a, b = Vector(a), Vector(b)
    direction = b - a
    obj = uv(name, (a + b) * .5, (radius[0], radius[1], direction.length * .5 + min(radius) * .6), mat)
    obj.rotation_euler = direction.to_track_quat('Z', 'Y').to_euler()
    return obj


def fuse(name, objects, mat, voxel=.037):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    obj = objects[0]
    obj.name = name
    mod = obj.modifiers.new('Continuous sculpt volume', 'REMESH')
    mod.mode, mod.voxel_size = 'VOXEL', voxel
    mod.use_smooth_shade = True
    bpy.ops.object.modifier_apply(modifier=mod.name)
    mod = obj.modifiers.new('Sculpt smoothing', 'SMOOTH')
    mod.factor, mod.iterations = 1.1, 5
    bpy.ops.object.modifier_apply(modifier=mod.name)
    mod = obj.modifiers.new('Surface refinement', 'SUBSURF')
    mod.levels, mod.render_levels = 1, 1
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    return obj


pieces = []
for name, loc, scale in [
    ('Rib cage', (0, .62, 1.58), (.49, 1.08, .67)),
    ('Haunch', (0, 1.35, 1.60), (.48, .65, .59)),
    ('Withers', (0, -.03, 1.62), (.45, .55, .59)),
    ('Forward neck', (0, -.58, 1.34), (.38, .65, .49)),
    ('Cranium', (0, -1.18, 1.30), (.43, .48, .43)),
    ('Brow', (0, -1.42, 1.30), (.375, .32, .31)),
    ('Muzzle bridge', (0, -1.70, 1.11), (.205, .48, .23)),
]:
    pieces.append(uv(name, loc, scale, rust))
for side in [-1, 1]:
    pieces.append(uv('Cheek', (.30 * side, -1.21, 1.17), (.23, .34, .26), rust))
    pieces.append(between('Shoulder', (.34 * side, -.02, 1.55), (.36 * side, -.18, .91), (.18, .22), rust))
    pieces.append(between('Upper hind leg', (.36 * side, 1.42, 1.50), (.43 * side, 1.03, .91), (.22, .25), rust))
body = fuse('Fox | continuous body and head sculpt', pieces, rust)
body['Design'] = 'Forward-stepping red fox, head lowered. Photo-inspired single-view reconstruction.'
body['Editing'] = 'Editable sculpt surface; separate detailed face and toggleable groom collection.'
legs = []
for name, knee, hock, paw in [
    ('Fore L', (-.36, -.18, .97), (-.36, -.41, .35), (-.36, -.72, .135)),
    ('Fore R', (.36, -.09, .99), (.39, -.10, .37), (.39, -.30, .135)),
    ('Hind L', (-.43, 1.06, .96), (-.45, 1.65, .49), (-.45, 1.48, .135)),
    ('Hind R', (.43, 1.02, .95), (.46, 1.47, .45), (.46, 1.20, .135)),
]:
    parts = [between(name + ' shin', knee, hock, (.104, .12), blackcoat), between(name + ' ankle', hock, paw, (.08, .09), blackcoat), uv(name + ' paw', paw, (.15, .22, .12), blackcoat)]
    legs.append(fuse(name + ' | charcoal stocking', parts, blackcoat, .023))
    for j in range(3):
        x = paw[0] + (j - 1) * .085
        uv(name + ' toe ' + str(j + 1), (x, paw[1] - .12, .099), (.059, .11, .073), blackcoat, segments=24, rings=16)
        uv(name + ' claw ' + str(j + 1), (x, paw[1] - .215, .079), (.020, .045, .017), horn, segments=20, rings=12)

bib = uv('Cream | throat bib', (0, -.63, 1.035), (.28, .52, .315), cream)
chest = uv('Cream | chest bib', (0, -.15, 1.26), (.295, .24, .43), cream)
chin = uv('Cream | lower jaw', (0, -1.74, .885), (.176, .40, .082), cream, 'face')
uv('Mouth | lip separation', (0, -1.84, .938), (.172, .31, .028), mouthmat, 'face')
white_face = [chin]
for side in [-1, 1]:
    white_face.append(uv('Cream | whisker pad ' + str(side), (.094 * side, -1.88, 1.012), (.113, .28, .115), cream, 'face'))
    white_face.append(uv('Cream | cheek ruff ' + str(side), (.324 * side, -1.25, 1.066), (.172, .32, .144), cream, 'face', rotation=(0, side * .17, side * -.21)))
uv('Nose | leather', (0, -2.115, 1.055), (.130, .09, .077), nosemat, 'face')
for side in [-1, 1]:
    uv('Nostril ' + str(side), (side * .078, -2.180, 1.053), (.029, .012, .020), pupilmat, 'face', segments=24, rings=16)


def curve_object(name, paths, mat, radius=.002, group='face'):
    data = bpy.data.curves.new(name, 'CURVE')
    data.dimensions = '3D'
    data.resolution_u = 12
    data.bevel_depth, data.bevel_resolution = radius, 2
    data.materials.append(mat)
    for pts in paths:
        spline = data.splines.new('BEZIER')
        spline.bezier_points.add(len(pts) - 1)
        for i, point in enumerate(pts):
            bp = spline.bezier_points[i]
            bp.co = point
            bp.radius = max(.07, 1 - i / (len(pts) - 1) * .93)
            bp.handle_left_type = bp.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, data)
    groups[group].objects.link(obj)
    return obj


# Rounded triangular ear shells with black rims and recessed inner faces.
ears, inner_ears = [], []
def make_ear(side, inner=False):
    rings = [(0, .194, .11), (.15, .182, .085), (.33, .138, .061), (.51, .072, .035), (.65, .005, .004)]
    if inner:
        rings = [(.065, .136, .014), (.20, .13, .014), (.37, .091, .012), (.52, .041, .009), (.59, .004, .002)]
    verts, faces = [], []
    n = 20
    for z, w, depth in rings:
        center = Vector((side * (.30 + z * .19), -.97 + z * .15 - (.083 if inner else 0), 1.55 + z))
        for k in range(n):
            a = k * 2 * math.pi / n
            verts.append(tuple(center + Vector((w * math.cos(a), depth * math.sin(a), 0))))
    for j in range(len(rings) - 1):
        for k in range(n):
            a, b = j * n + k, j * n + (k + 1) % n
            faces.append((a, b, b + n, a + n))
    faces += [tuple(reversed(range(n))), tuple((len(rings) - 1) * n + k for k in range(n))]
    mesh = bpy.data.meshes.new('Ear shell')
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    mesh.materials.append(pink if inner else blackcoat)
    obj = bpy.data.objects.new(('Ear | inner velvet ' if inner else 'Ear | dark rim ') + str(side), mesh)
    groups['face'].objects.link(obj)
    for p in mesh.polygons:
        p.use_smooth = True
    mod = obj.modifiers.new('Soft ear rim', 'SUBSURF')
    mod.levels = mod.render_levels = 2
    return obj
for side in [-1, 1]:
    ears.append(make_ear(side))
    inner_ears.append(make_ear(side, True))

# Oblique almond eye sockets and radial iris striations.
for side in [-1, 1]:
    center = Vector((side * .272, -1.603, 1.312))
    normal = Vector((side * .36, -1, .08)).normalized()
    quat = normal.to_track_quat('Y', 'Z')
    rot = quat.to_euler()
    uv('Eye | almond lid ' + str(side), center, (.107, .019, .061), lidmat, 'face', rotation=rot)
    eye = uv('Eye | amber iris ' + str(side), center + normal * .017, (.059, .011, .051), amber, 'face', rotation=rot)
    uv('Eye | vertical pupil ' + str(side), center + normal * .027, (.015, .004, .044), pupilmat, 'face', rotation=rot)
    # Sculpted upper and lower eyelids integrate the eye with the brow.
    upper = [center + normal * .021 + quat @ Vector((x, 0, z)) for x, z in [(-.103, -.002), (-.06, .040), (0, .060), (.060, .040), (.103, -.002)]]
    lower = [center + normal * .019 + quat @ Vector((x, 0, z)) for x, z in [(-.103, -.002), (-.06, -.036), (0, -.052), (.060, -.033), (.103, -.002)]]
    curve_object('Eye | upper copper lid ' + str(side), [upper], rust, .018)
    curve_object('Eye | lower copper lid ' + str(side), [lower], rust, .012)
    paths = []
    for i in range(48):
        a = 2 * math.pi * i / 48
        paths.append([center + normal * .027 + quat @ Vector((math.cos(a) * r, 0, math.sin(a) * r * .86)) for r in [.027, .039, .052]])
    curve_object('Iris | radial pigment ' + str(side), paths, horn, .00045)

tail_points = [((0, 1.78, 1.65), .20), ((.25, 2.02, 1.49), .27), ((.60, 2.25, 1.21), .31), ((.99, 2.32, .93), .30), ((1.34, 2.22, .70), .25), ((1.55, 2.01, .59), .19), ((1.71, 1.79, .60), .11), ((1.79, 1.59, .67), .008)]
verts, faces = [], []
n = 28
for j, (pos, r) in enumerate(tail_points):
    prev = Vector(tail_points[max(0, j - 1)][0])
    nxt = Vector(tail_points[min(len(tail_points) - 1, j + 1)][0])
    tangent = (nxt - prev).normalized()
    u = tangent.cross(Vector((0, 0, 1))).normalized()
    v = tangent.cross(u).normalized()
    for k in range(n):
        a = k * 2 * math.pi / n
        verts.append(tuple(Vector(pos) + r * (u * math.cos(a) + v * math.sin(a))))
for j in range(len(tail_points) - 1):
    for k in range(n):
        faces.append((j * n + k, j * n + (k + 1) % n, (j + 1) * n + (k + 1) % n, (j + 1) * n + k))
faces += [tuple(reversed(range(n))), tuple((len(tail_points) - 1) * n + k for k in range(n))]
mesh = bpy.data.meshes.new('Flowing tail brush')
mesh.from_pydata(verts, [], faces)
mesh.update()
mesh.materials.append(rust)
mesh.materials.append(cream)
tail = bpy.data.objects.new('Tail | curved brush with white tip', mesh)
groups['body'].objects.link(tail)
for i, p in enumerate(mesh.polygons):
    p.use_smooth = True
    p.material_index = int(i >= 5 * n)
mod = tail.modifiers.new('Tail refinement', 'SUBSURF')
mod.levels = mod.render_levels = 2


# Directional tapered strands are geometry, independent of deprecated particle systems.
def groom(obj, count, length, width, palette, mode='body'):
    bpy.context.view_layer.update()
    depsgraph = bpy.context.evaluated_depsgraph_get()
    evaluated = obj.evaluated_get(depsgraph)
    mesh = evaluated.to_mesh()
    mesh.calc_loop_triangles()
    tris, cumulative, area = [], [], 0.0
    matrix = evaluated.matrix_world
    normals = matrix.to_3x3()
    for tri in mesh.loop_triangles:
        positions = [matrix @ mesh.vertices[i].co for i in tri.vertices]
        ns = [(normals @ mesh.vertices[i].normal).normalized() for i in tri.vertices]
        ar = (positions[1] - positions[0]).cross(positions[2] - positions[0]).length * .5
        area += ar
        cumulative.append(area)
        tris.append((positions, ns, mesh.polygons[tri.polygon_index].material_index))
    evaluated.to_mesh_clear()
    verts, faces, indices = [], [], []
    mats = palette + white_hairs if mode == 'tail' else palette
    for i in range(count):
        positions, ns, mat_index = tris[bisect.bisect_left(cumulative, random.random() * area)]
        a, b = random.random(), random.random()
        if a + b > 1:
            a, b = 1 - a, 1 - b
        weights = (1 - a - b, a, b)
        root = sum((p * w for p, w in zip(positions, weights)), Vector())
        normal = sum((n * w for n, w in zip(ns, weights)), Vector()).normalized()
        if mode == 'body' and root.z < .5:
            continue
        strand_length = length * random.uniform(.6, 1.3)
        flow = Vector((root.x * .1, .8, -.12))
        if mode == 'body' and root.y < -.88:
            if root.y < -1.65:
                strand_length *= .32
                flow = Vector((root.x * .45, .45, .65))
            else:
                strand_length *= .58
                flow = Vector((root.x * .8, .8, .15))
            # Preserve the eye opening.
            if abs(root.y + 1.58) < .09 and abs(root.z - 1.312) < .08 and abs(abs(root.x) - .272) < .105:
                continue
        elif mode == 'leg':
            flow = Vector((0, -.1, -1))
        elif mode == 'white':
            flow = Vector((root.x * .8, .35, -.7))
        elif mode == 'ear':
            flow = Vector((root.x * .25, 0, 1))
        elif mode == 'tail':
            j = min(range(len(tail_points) - 1), key=lambda j: (root - Vector(tail_points[j][0])).length)
            flow = (Vector(tail_points[j + 1][0]) - Vector(tail_points[j][0])).normalized()
        tangent = flow - normal * flow.dot(normal)
        if tangent.length < .001:
            tangent = normal.cross(Vector((1, 0, 0)))
        tangent.normalize()
        tangent += Vector((random.uniform(-.15, .15), random.uniform(-.15, .15), random.uniform(-.15, .15)))
        direction = (normal * .50 + tangent * .86).normalized()
        cross = normal.cross(direction).normalized()
        if cross.length < .1:
            cross = direction.cross(Vector((1, 0, 0))).normalized()
        up = direction.cross(cross).normalized()
        radius = width * random.uniform(.6, 1.25)
        first = len(verts)
        for k, t in enumerate([0, .32, .70, 1]):
            center = root + normal * .002 + normal * strand_length * .34 * t + tangent * strand_length * (.33 * t + .57 * t * t)
            r = radius * [1, .82, .46, .025][k]
            for side in range(3):
                angle = side * 2 * math.pi / 3
                verts.append(tuple(center + (cross * math.cos(angle) + up * math.sin(angle)) * r))
        choice = random.randrange(len(palette))
        if mode == 'tail' and mat_index == 1:
            choice = len(palette) + random.randrange(len(white_hairs))
        for k in range(3):
            for side in range(3):
                faces.append((first + k * 3 + side, first + k * 3 + (side + 1) % 3, first + (k + 1) * 3 + (side + 1) % 3, first + (k + 1) * 3 + side))
                indices.append(choice)
    data = bpy.data.meshes.new(obj.name + ' | groom mesh')
    data.from_pydata(verts, [], faces)
    data.update()
    for mat in mats:
        data.materials.append(mat)
    for poly, index in zip(data.polygons, indices):
        poly.material_index = index
        poly.use_smooth = True
    hair = bpy.data.objects.new(obj.name + ' | directional guard hairs', data)
    groups['fur'].objects.link(hair)
    hair['Source surface'] = obj.name
    hair['Strands'] = len(verts) // 12
    print('GROOM', obj.name, len(verts) // 12, flush=True)
    return hair


groom(body, 100000, .078, .00125, copper_hairs)
for obj in legs:
    groom(obj, 2600, .035, .0014, black_hairs, 'leg')
for obj in [bib, chest] + white_face:
    groom(obj, 3600 if obj in [bib, chest] else 2400, .067 if 'ruff' in obj.name else .036, .0014, white_hairs, 'white')
groom(tail, 21000, .110, .0015, copper_hairs, 'tail')
for obj in ears:
    groom(obj, 1500, .035, .0012, black_hairs, 'ear')
for obj in inner_ears:
    groom(obj, 1100, .029, .0011, white_hairs, 'ear')

for side in [-1, 1]:
    whiskers = []
    for j in range(7):
        y, z = -1.88 + j * .018, 1.01 + (j % 3 - 1) * .027
        start = Vector((side * .16, y, z))
        whiskers.append([start, start + Vector((side * .16, -.04, .016)), start + Vector((side * (.36 + j * .015), .07 * (j - 3), .055 * (j - 3)))])
    curve_object('Whiskers | swept ' + str(side), whiskers, whiskermat, .0017)

# Neutral wet-road display, recalling the reference without obscuring the model.
asphalt = material('Road | charcoal aggregate', (.038, .048, .052), .73, True)
nodes, links = asphalt.node_tree.nodes, asphalt.node_tree.links
noise = nodes.new('ShaderNodeTexNoise')
noise.inputs['Scale'].default_value = 350
bump = nodes.new('ShaderNodeBump')
bump.inputs['Strength'].default_value, bump.inputs['Distance'].default_value = .65, .017
links.new(noise.outputs['Fac'], bump.inputs['Height'])
links.new(bump.outputs[0], nodes.get('Principled BSDF').inputs['Normal'])
yellow = material('Road | ochre yellow line', (.68, .32, .045), .65, True)
bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -.020))
ground = move(bpy.context.object, 'stage')
ground.name = 'Road | asphalt ground'
ground.data.materials.append(asphalt)
bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, -.018))
stripe = move(bpy.context.object, 'stage')
stripe.name, stripe.scale = 'Road | central yellow line', (.21, 35, 1)
stripe.data.materials.append(yellow)


def aim(obj, point):
    obj.rotation_euler = (Vector(point) - obj.location).to_track_quat('-Z', 'Y').to_euler()


def light(name, loc, energy, color, size, target):
    data = bpy.data.lights.new(name, 'AREA')
    data.energy, data.color = energy, color
    data.shape, data.size = 'DISK', size
    obj = bpy.data.objects.new(name, data)
    groups['stage'].objects.link(obj)
    obj.location = loc
    aim(obj, target)


light('Key | broad warm sky', (-3.5, -4.5, 6), 850, (1, .78, .57), 4, (0, -.6, 1.1))
light('Fill | pale cool sky', (4, -1, 4), 550, (.64, .80, 1), 3.5, (0, -.5, 1.2))
light('Rim | autumn sun', (-1, 3.8, 4.5), 1050, (1, .48, .19), 3, (0, .5, 1.4))
light('Face | eye glint', (0, -4, 3.5), 70, (1, .90, .77), 1.4, (0, -1.5, 1.3))
world = bpy.data.worlds.new('World | overcast blue grey')
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (.16, .21, .27, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = .45
scene.world = world
camera_data = bpy.data.cameras.new('Three-quarter portrait')
camera = bpy.data.objects.new('Camera | three-quarter portrait', camera_data)
groups['stage'].objects.link(camera)
camera.location = (3.15, -7.85, 2.60)
aim(camera, (.18, .15, 1.08))
camera_data.type, camera_data.lens = 'PERSP', 54
camera_data.dof.use_dof = False
scene.camera = camera

reference_path = '/var/folders/_t/71f89rxs7gn0wn95t0f1qdh00000gn/T/codex-clipboard-735d9ad3-422c-471c-bd57-d47ec373e56c.jpg'
if os.path.exists(reference_path):
    image = bpy.data.images.load(reference_path, check_existing=True)
    image.pack()
    ref = bpy.data.objects.new('Reference | supplied red fox photograph', None)
    ref.empty_display_type, ref.data = 'IMAGE', image
    ref.empty_display_size, ref.location = 4, (-5, 1, 2)
    ref.hide_render = True
    groups['reference'].objects.link(ref)
    ref.hide_set(True)

scene.render.engine = 'CYCLES'
scene.cycles.samples = 64
scene.cycles.use_denoising = True
scene.render.resolution_x, scene.render.resolution_y = 1200, 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.view_settings.view_transform = 'AgX'
scene.render.filepath = os.path.join(OUT, 'Red_Fox_Render.png')
scene['Reconstruction note'] = 'Single photograph: visible head and coat inspired by reference; occluded hindquarters and tail interpreted from red fox anatomy. Static sculpt, no rig.'
scene['Fur'] = 'Separate collection of directional tapered mesh strands; hide collection for fast sculpt editing.'
text = bpy.data.texts.new('ABOUT THE RED FOX')
text.write('REFERENCE-INSPIRED RED FOX\n\nStatic editable sculpt with layered directional fur.\nCollections: body, face, fur, stage, packed reference.\nThe supplied image does not show all sides; back legs and tail are reconstructed interpretations.\nHide collection 03 for lighter editing. No animation rig or production retopology.\n')
bpy.ops.object.select_all(action='DESELECT')
body.select_set(True)
bpy.context.view_layer.objects.active = body
for screen in bpy.data.screens:
    for area in screen.areas:
        if area.type == 'VIEW_3D':
            area.spaces.active.region_3d.view_perspective = 'CAMERA'
            area.spaces.active.shading.type = 'MATERIAL'
            area.spaces.active.overlay.show_overlays = False
scene.unit_settings.system = 'METRIC'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, 'Red_Fox.blend'))
print('SAVED', bpy.data.filepath, flush=True)
bpy.ops.render.render(write_still=True)
print('RENDER_COMPLETE', scene.render.filepath, flush=True)
# An additional low frontal view makes the reference pose easy to compare.
camera.location = (.32, -6.6, 1.78)
aim(camera, (0, -.32, 1.12))
camera.data.lens = 60
scene.render.resolution_x, scene.render.resolution_y = 1200, 1000
scene.render.filepath = os.path.join(OUT, 'Red_Fox_Front.png')
bpy.ops.render.render(write_still=True)
print('FRONT_COMPLETE', scene.render.filepath, flush=True)

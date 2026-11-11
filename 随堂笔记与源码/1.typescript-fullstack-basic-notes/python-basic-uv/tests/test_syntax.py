from importlib import import_module


def test_type_basics_demo() -> None:
    module = import_module("python_basic.syntax.01_types")
    assert module.demo()["count"] == 42


def test_custom_type_demo() -> None:
    module = import_module("python_basic.syntax.02_custom_types")
    user, intro, greeting = module.demo()
    assert user["name"] == "heyi"
    assert intro == "heyi: 18"
    assert "heyi" in greeting


def test_union_and_type_guard_demos() -> None:
    union = import_module("python_basic.syntax.03_union")
    guards = import_module("python_basic.syntax.06_type_guards")
    assert union.demo()[0].startswith("图片")
    assert guards.demo() == ("  hello", "say: hello")


def test_generic_and_typing_utils_demos() -> None:
    generic = import_module("python_basic.syntax.04_generics")
    utils = import_module("python_basic.syntax.05_typing_utils")
    assert generic.demo()[1] == ("1", "heyi")
    assert utils.demo()[0] == {"id": 1, "name": "heyi"}


def test_inference_and_decorator_demos() -> None:
    inference = import_module("python_basic.syntax.07_type_inference")
    decorators = import_module("python_basic.syntax.08_decorators")
    assert inference.demo() == ("one", True)
    assert decorators.demo() == ("你好，heyi。", True)

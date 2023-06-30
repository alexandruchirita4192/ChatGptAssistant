run_web: run_api
	cd ChatGptFrontEnd && ionic serve . &
run_api: recreate_api_venv
	bash -c "cd ChatGptBackEnd && source venv/bin/activate && python api.py" &

stop_api:
	killall python > /dev/null 2> /dev/null
stop_web:
	killall ionic > /dev/null 2> /dev/null
stop_electron:
	killall chat-gpt-assistant	
stop_all: stop_api stop_web stop_electron

clean_electron_all:
	rm -rf ChatGptFrontEnd/chat-gpt-assistant-*
build_electron_linux: clean_electron_all
	cd ChatGptFrontEnd && electron-packager . --platform=linux --overwrite
build_electron_win32: clean_electron_all
	cd ChatGptFrontEnd && electron-packager . --platform=win32 --overwrite
build_electron_all: clean_electron_all
	cd ChatGptFrontEnd && electron-packager . --platform=all --overwrite

run_electron_linux: run_api build_electron_linux
	./ChatGptFrontEnd/chat-gpt-assistant-linux-x64/chat-gpt-assistant &

clean_api_venv:
	rm -rf ChatGptBackEnd/venv
recreate_api_venv: clean_api_venv
	cd ChatGptBackEnd && python3 -m venv venv
	bash -c "cd ChatGptBackEnd && source venv/bin/activate && pip install -r requirements.txt"

clean_all: clean_api_venv clean_electron_all
